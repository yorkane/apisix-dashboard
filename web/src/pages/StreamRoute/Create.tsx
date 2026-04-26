import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, InputNumber, notification } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { history, useParams } from 'umi';

import UpstreamForm from '@/components/Upstream/UpstreamForm';
import { fetchList as fetchUpstreamList } from '@/components/Upstream/service';
import { create, update, fetchItem } from './service';

const StreamRouteCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [upstreamForm] = Form.useForm();
  const upstreamRef = useRef<any>();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [upstreamList, setUpstreamList] = useState<any[]>([]);

  const fetchUpstreams = async () => {
    const { data } = await fetchUpstreamList();
    setUpstreamList(data);
  };

  useEffect(() => {
    fetchUpstreams();
    if (isEdit) {
      fetchItem(id).then((data) => {
        form.setFieldsValue({
          desc: data.desc,
          server_addr: data.server_addr,
          server_port: data.server_port,
          sni: data.sni,
          remote_addr: data.remote_addr,
        });
        if (data.upstream_id) {
          upstreamForm.setFieldsValue({ upstream_id: data.upstream_id });
        } else if (data.upstream) {
          // It's a custom upstream
          upstreamForm.setFieldsValue({ upstream_id: 'Custom', ...data.upstream });
        }
      });
    } else {
       upstreamForm.setFieldsValue({ upstream_id: 'Custom' });
    }
  }, [isEdit, id, upstreamForm, form]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload: StreamRouteModule.BaseData = {
        ...values,
      };

      const upstreamData = upstreamRef.current?.getData();
      
      if (upstreamData?.upstream_id && upstreamData.upstream_id !== 'Custom' && upstreamData.upstream_id !== 'None') {
        payload.upstream_id = upstreamData.upstream_id;
      } else if (upstreamData && upstreamData.upstream_id !== 'None') {
        // extract upstream data, exclude upstream_id
        const { upstream_id, ...restUpstream } = upstreamData;
        payload.upstream = restUpstream;
      }

      if (isEdit) {
        await update(id, payload);
        notification.success({ message: 'Update stream route successfully' });
      } else {
        await create(payload);
        notification.success({ message: 'Create stream route successfully' });
      }
      history.push('/stream_routes/list');
    } catch (e) {
      // Validation error or API error
    }
  };

  return (
    <PageContainer title={isEdit ? 'Edit Stream Route' : 'Create Stream Route'}>
      <Card title="Base Information">
        <Form form={form} layout="vertical">
          <Form.Item label="Description" name="desc">
            <Input />
          </Form.Item>
          <Form.Item label="Server Addr" name="server_addr">
            <Input placeholder="e.g. 127.0.0.1" />
          </Form.Item>
          <Form.Item label="Server Port" name="server_port">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="SNI" name="sni">
            <Input />
          </Form.Item>
          <Form.Item label="Remote Addr" name="remote_addr">
            <Input placeholder="e.g. 192.168.1.101" />
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="Upstream" style={{ marginTop: 16 }}>
        <UpstreamForm
          ref={upstreamRef}
          form={upstreamForm}
          list={upstreamList}
          showSelector
          required={false}
        />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => history.push('/stream_routes/list')}>
          Cancel
        </Button>
      </Card>
    </PageContainer>
  );
};

export default StreamRouteCreate;
