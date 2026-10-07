terraform {
  backend "s3" {
    bucket  = "nam-le-dev-state"
    key     = "global/s3/terraform.tfstate"
    region  = "eu-west-2"
    profile = "general-test"
  }
}

resource "aws_s3_bucket" "site" {
  bucket = "nam-le.dev"
}

resource "aws_s3_bucket_website_configuration" "site_website" {
  bucket = aws_s3_bucket.site.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "site_public_access_block" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "site_policy" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:GetObject"]

    resources = ["${aws_s3_bucket.site.arn}/*"]
  }
}

locals {
  site_root = "${path.module}/.."

  content_types = {
    html = "text/html"
    css  = "text/css"
    js   = "application/javascript"
    json = "application/json"
    pdf  = "application/pdf"
    svg  = "image/svg+xml"
    png  = "image/png"
    jpg  = "image/jpeg"
    jpeg = "image/jpeg"
    webp = "image/webp"
    gif  = "image/gif"
    ico  = "image/x-icon"
    mp4  = "video/mp4"
    webm = "video/webm"
  }

  # Everything the site serves: root pages plus css/, js/ and assets/
  site_files = setunion(
    fileset(local.site_root, "*.html"),
    fileset(local.site_root, "{css,js,assets}/**/*.{${join(",", keys(local.content_types))}}"),
  )
}

resource "aws_s3_object" "site_files" {
  for_each = local.site_files

  bucket       = aws_s3_bucket.site.id
  key          = each.value
  source       = "${local.site_root}/${each.value}"
  content_type = lookup(local.content_types, lower(reverse(split(".", each.value))[0]), "application/octet-stream")
  etag         = filemd5("${local.site_root}/${each.value}")
}

resource "aws_s3_bucket_policy" "site_policy" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site_policy.json

  depends_on = [aws_s3_bucket_public_access_block.site_public_access_block]
}


resource "aws_s3_bucket" "state" {
  bucket = "nam-le-dev-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}
