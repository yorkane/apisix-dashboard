import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, notification } from 'antd';
import React, { useRef } from 'react';
import { history, useIntl } from 'umi';

import { timestampToLocaleString } from '@/helpers';
import { fetchList, remove } from './service';

const StreamRouteList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const handleRemove = async (id: string) => {
    try {
      await remove(id);
      notification.success({ message: intl.formatMessage({ id: 'page.streamRoute.delete.success' }) });
      actionRef.current?.reload();
    } catch (error) {
      // handled by global errorHandler
    }
  };

  const columns: ProColumns<StreamRouteModule.Entity>[] = [
    {
      title: intl.formatMessage({ id: 'page.streamRoute.serverAddr' }),
      dataIndex: 'server_addr',
    },
    {
      title: intl.formatMessage({ id: 'page.streamRoute.serverPort' }),
      dataIndex: 'server_port',
    },
    {
      title: intl.formatMessage({ id: 'page.streamRoute.sni' }),
      dataIndex: 'sni',
    },
    {
      title: intl.formatMessage({ id: 'page.streamRoute.remoteAddr' }),
      dataIndex: 'remote_addr',
    },
    {
      title: intl.formatMessage({ id: 'page.streamRoute.desc' }),
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'component.global.updateTime' }),
      dataIndex: 'update_time',
      hideInSearch: true,
      render: (text) => timestampToLocaleString(text as number),
    },
    {
      title: intl.formatMessage({ id: 'component.global.operation' }),
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => history.push(`/stream_routes/${record.id}/edit`)}
            style={{ marginRight: 10 }}
          >
            {intl.formatMessage({ id: 'component.global.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'page.streamRoute.delete.confirm' })}
            onConfirm={() => handleRemove(record.id!)}
          >
            <Button type="primary" danger>
              {intl.formatMessage({ id: 'component.global.delete' })}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'menu.stream_routes' })}>
      <ProTable<StreamRouteModule.Entity>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={fetchList}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => history.push('/stream_routes/create')}
          >
            <PlusOutlined /> {intl.formatMessage({ id: 'component.global.create' })}
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default StreamRouteList;
