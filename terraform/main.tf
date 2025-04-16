provider "google" {
  project = var.project_id
  region  = var.region
}

provider "kubernetes" {
  host                   = google_container_cluster.primary.endpoint
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}

resource "kubernetes_namespace" "devnet" {
  metadata {
    name = "devnet"
  }
}

resource "kubernetes_deployment" "geth" {
  metadata {
    name      = "geth-devnet"
    namespace = kubernetes_namespace.devnet.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "geth"
      }
    }

    template {
      metadata {
        labels = {
          app = "geth"
        }
      }

      spec {
        container {
          name  = "geth"
          image = var.docker_image
          args  = [
            "--http", "--http.addr", "0.0.0.0",
            "--http.api", "eth,web3,net,personal",
            "--allow-insecure-unlock"
          ]

          port {
            container_port = 8545
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "geth" {
  metadata {
    name      = "geth-service"
    namespace = kubernetes_namespace.devnet.metadata[0].name
  }

  spec {
    selector = {
      app = "geth"
    }

    type = "LoadBalancer"

    port {
      port        = 8545
      target_port = 8545
    }
  }
}
