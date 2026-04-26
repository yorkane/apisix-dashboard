FROM golang:1.19 as api-builder

WORKDIR /usr/local/apisix-dashboard

COPY . .

RUN go env -w GO111MODULE=on \
    && CGO_ENABLED=0 ./api/build.sh

FROM node:16-alpine as fe-builder

WORKDIR /usr/local/apisix-dashboard

COPY . .

WORKDIR /usr/local/apisix-dashboard/web

RUN yarn install \
    && yarn build

FROM alpine:latest as prod

WORKDIR /usr/local/apisix-dashboard

COPY --from=api-builder /usr/local/apisix-dashboard/output/ ./
COPY --from=fe-builder /usr/local/apisix-dashboard/output/ ./

RUN mkdir logs

EXPOSE 9000

CMD [ "/usr/local/apisix-dashboard/manager-api" ]
