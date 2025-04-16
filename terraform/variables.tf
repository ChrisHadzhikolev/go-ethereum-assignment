variable "project_id" {}
variable "region" {
  default = "us-central1"
}
variable "cluster_name" {}
variable "docker_image" {
  default = "krishum77/geth-with-contracts:latest"
}
