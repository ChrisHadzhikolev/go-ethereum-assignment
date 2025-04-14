FROM krishum77/get-etherium-assignment:latest

WORKDIR /app

COPY hardhat/artifacts ./artifacts
COPY hardhat/cache ./cache

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8545 || exit 1

EXPOSE 8545

CMD ["geth"]
