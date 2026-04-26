import { request } from 'umi';

export const fetchList = ({ current = 1, pageSize = 10, ...res }: any) => {
  return request<Res<ResListData<StreamRouteModule.Entity>>>('/stream_routes', {
    params: {
      ...res,
      page: current,
      page_size: pageSize,
    },
  }).then(({ data }) => {
    return {
      data: data.rows,
      total: data.total_size,
    };
  });
};

export const fetchItem = (id: string) => {
  return request<{ data: StreamRouteModule.Entity }>(`/stream_routes/${id}`).then(
    (res) => res.data,
  );
};

export const create = (data: StreamRouteModule.BaseData) => {
  return request('/stream_routes', {
    method: 'POST',
    data,
  });
};

export const update = (id: string, data: StreamRouteModule.BaseData) => {
  return request(`/stream_routes/${id}`, {
    method: 'PUT',
    data,
  });
};

export const remove = (id: string) => {
  return request(`/stream_routes/${id}`, {
    method: 'DELETE',
  });
};
