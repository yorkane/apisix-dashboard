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
      notification.success({ message: 'Remove stream route successfully' });
      actionRef.current?.reload();
    } catch (error) {
      // handled by global errorHandler
    }
  };

  const columns: ProColumns<StreamRouteModule.Entity>[] = [
    {
      title: 'Server Addr',
      dataIndex: 'server_addr',
    },
    {
      title: 'Server Port',
      dataIndex: 'server_port',
    },
    {
      title: 'SNI',
      dataIndex: 'sni',
    },
    {
      title: 'Remote Addr',
      dataIndex: 'remote_addr',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: 'Update Time',
      dataIndex: 'update_time',
      hideInSearch: true,
      render: (text) => timestampToLocaleString(text as number),
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => history.push(`/stream_routes/${record.id}/edit`)}
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this route?"
            onConfirm={() => handleRemove(record.id!)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer title="Stream Route">
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
            <PlusOutlined /> Create
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default StreamRouteList;
