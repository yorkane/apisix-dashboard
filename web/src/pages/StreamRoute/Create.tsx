import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, InputNumber, notification } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { history, useParams, useIntl } from 'umi';

import UpstreamForm from '@/components/Upstream/UpstreamForm';
import { fetchUpstreamList } from '@/components/Upstream/service';
import { create, update, fetchItem } from './service';

const StreamRouteCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [upstreamForm] = Form.useForm();
  const upstreamRef = useRef<any>();
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
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
        notification.success({ message: intl.formatMessage({ id: 'page.streamRoute.update.success' }) });
      } else {
        await create(payload);
        notification.success({ message: intl.formatMessage({ id: 'page.streamRoute.create.success' }) });
      }
      history.push('/stream_routes/list');
    } catch (e) {
      // Validation error or API error
    }
  };

  return (
    <PageContainer title={isEdit ? intl.formatMessage({ id: 'page.streamRoute.edit' }) : intl.formatMessage({ id: 'page.streamRoute.create' })}>
      <Card title={intl.formatMessage({ id: 'page.streamRoute.baseInfo' })}>
        <Form form={form} layout="vertical">
          <Form.Item label={intl.formatMessage({ id: 'page.streamRoute.desc' })} name="desc">
            <Input />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'page.streamRoute.serverAddr' })} name="server_addr">
            <Input placeholder="e.g. 127.0.0.1" />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'page.streamRoute.serverPort' })} name="server_port">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'page.streamRoute.sni' })} name="sni">
            <Input />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'page.streamRoute.remoteAddr' })} name="remote_addr">
            <Input placeholder="e.g. 192.168.1.101" />
          </Form.Item>
        </Form>
      </Card>
      
      <Card title={intl.formatMessage({ id: 'page.streamRoute.upstream' })} style={{ marginTop: 16 }}>
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
          {intl.formatMessage({ id: 'component.global.submit' })}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => history.push('/stream_routes/list')}>
          {intl.formatMessage({ id: 'component.global.cancel' })}
        </Button>
      </Card>
    </PageContainer>
  );
};

export default StreamRouteCreate;
