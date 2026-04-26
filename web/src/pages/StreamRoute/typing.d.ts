// @ts-ignore
declare namespace StreamRouteModule {
  interface BaseData {
    id?: string;
    server_addr?: string;
    server_port?: number;
    sni?: string;
    remote_addr?: string;
    upstream_id?: string;
    upstream?: any;
    desc?: string;
  }

  interface Entity extends BaseData {
    create_time?: number;
    update_time?: number;
  }

  interface ResBody {
    data: Entity[];
    total: number;
  }
}
