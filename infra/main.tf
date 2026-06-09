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

resource "aws_s3_object" "site_files" {
  for_each = fileset("${path.module}/../", "**/*.{html,css,js}")

  bucket = aws_s3_bucket.site.id
  key    = each.value
  source = "${path.module}/../${each.value}"
  content_type = lookup({
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "text/plain")
  etag = filemd5("${path.module}/../${each.value}")
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
