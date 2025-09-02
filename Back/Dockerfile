FROM 	node:22.0.0

WORKDIR /app

# Azure CLI en Debian/Ubuntu
RUN apt-get update && apt-get install -y ca-certificates curl apt-transport-https lsb-release gnupg \
 && curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg \
 && echo "deb [arch=amd64,arm64,armhf] https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" > /etc/apt/sources.list.d/azure-cli.list \
 && apt-get update && apt-get install -y azure-cli \
 && rm -rf /var/lib/apt/lists/*

COPY 	package*.json ./
RUN 	npm install
RUN     mkdir -p temp
COPY 	. .
EXPOSE 	3000
CMD ["/bin/sh","-lc", "\
  if ! az account show >/dev/null 2>&1; then \
    echo '==> No hay sesión de Azure CLI. Iniciando az login (device code)...'; \
    az login --use-device-code; \
  fi; \
  echo '==> Azure CLI OK'; \
  npm start \
"]