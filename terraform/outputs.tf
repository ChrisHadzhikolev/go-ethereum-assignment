output "geth_endpoint" {
  value = kubernetes_service.geth.status[0].load_balancer[0].ingress[0].ip
  description = "Public IP to access the Geth RPC interface"
}
