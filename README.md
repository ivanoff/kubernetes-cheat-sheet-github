## Server

### Docker registry docker-compose.yml

```
version: '3'

services:
  registry:
    image: registry:2
    restart: always
    ports:
    - "5000:5000"
    environment:
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
      REGISTRY_HTTP_HOST: https://docker.site
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry
      REGISTRY_AUTH_HTPASSWD_PATH: /auth
    volumes:
      - ./auth:/auth
      - ./data:/data
```

### Install MicroK8s on Linux

https://microk8s.io/?_gl=1*1onkckt*_gcl_au*MTg3NDQ3MjU1OS4xNzA5MDQ0OTYz&_ga=2.259187916.77857723.1709221606-674732395.1708519741

sudo snap install microk8s --classic
microk8s status --wait-ready
microk8s enable dashboard
microk8s enable dns
microk8s enable registry
microk8s enable istio
microk8s kubectl get all --all-namespaces
alias mkctl="microk8s kubectl
microk8s dashboard-proxy

###

mkctl create deployment nginx --image nginx
mkctl expose deployment nginx --port 80 --target-port 80 --selector app=nginx --type ClusterIP --name nginx

###

microk8s config > ~/.kube/config.client


## Client

### Dockerfile

```
FROM oven/bun:latest

WORKDIR /app

COPY ./api /app

RUN bun i

CMD ["bun", "--watch", "src/index.ts"]
```

###

sudo docker login https://docker.site

sudo docker build -t bunbb:0.1.3 .

sudo docker tag bunbb:0.1.3 docker.site/bunbb:0.1.3

sudo docker push docker.site/bunbb:0.1.3

###

snap install kubectl --classic

### ~/.kube/config

export KUBECONFIG=~/.kube/config

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ...
    server: ...
  name: microk8s-cluster
contexts:
- context:
...
```

### bunbb-pod.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bunbb-api-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: bunbb-api
  template:
    metadata:
      labels:
        app: bunbb-api
    spec:
      containers:
      - name: bunbb-api
        image: docker.site/bunbb:0.1.2
        ports:
        - containerPort: 3000
      imagePullSecrets:
      - name: docker-registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: bunbb-api-service
  annotations:
    service.beta.kubernetes.io/external-traffic: OnlyLocal
spec:
  type: LoadBalancer
  externalIPs:
    - 10.152.183.154
  selector:
    app: bunbb-api
  ports:
    - protocol: TCP
      port: 3030
      targetPort: 3000

--- /*
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bunbb-api-ingress
spec:
  rules:
  - host: kuber.site
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: bunbb-api-service
            port:
              number: 3030

```

### apply pod

kubectl apply -f bunbb-pod.yaml

### get

kubectl get pods
kubectl get svc
//kubectl get ingress

### logs

kubectl logs bunbb-api-deployment-57c9f89f9f-nzjqv -f

### delete

kubectl delete deployment bunbb-api-deployment
kubectl delete svc bunbb-api-service
//kubectl delete ingress bunbb-api-ingress
