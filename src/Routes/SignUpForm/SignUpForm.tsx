import React, { useState } from "react";
import styles from "../LoginForm/LoginForm.module.scss";
import MenuBar from "../../Components/MenuBar/MenuBar";
import { useTheme } from "../../Context/ThemeContext/ThemeContext";
import { useTranslation } from 'react-i18next';
import { Typography } from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { Form, Input, Button, Alert, Card } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, IdcardOutlined, SmileOutlined } from '@ant-design/icons';

const SignUpForm = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string; username: string; fullName: string }) => {
    setLoading(true);
    setError(null);
    const { email, password, username, fullName } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          fullName,
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        //background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
      }}
    >
      <MenuBar />
      <Card
        style={{
          width: 380,
          maxWidth: '95vw',
          marginTop: 32,
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          background: 'rgba(255,255,255,0.95)',
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <SmileOutlined style={{ fontSize: 36, color: '#1890ff' }} />
          <Typography variant="h5" mb={2} style={{ fontWeight: 700, marginTop: 8 }}>
            {t('signUp')} 🎉
          </Typography>
        </div>
        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label={t('email')}
            rules={[{ required: true, message: t('email') + ' ' + t('isRequired') }]}
          >
            <Input
              type="email"
              prefix={<MailOutlined style={{ color: '#1890ff' }} />}
              placeholder={t('email')}
              size="large"
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('password')}
            rules={[{ required: true, message: t('password') + ' ' + t('isRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder={t('password')}
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="username"
            label={t('username')}
            rules={[{ required: true, message: t('username') + ' ' + t('isRequired') }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder={t('username')}
              size="large"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="fullName"
            label={t('fullName')}
            rules={[{ required: true, message: t('fullName') + ' ' + t('isRequired') }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#1890ff' }} />}
              placeholder={t('fullName')}
              size="large"
              autoComplete="name"
            />
          </Form.Item>
          {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} showIcon />} 
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{ marginTop: 8, borderRadius: 8, fontWeight: 600 }}
            >
              {t('signUp')}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/sign-in" style={{ color: '#1890ff', fontWeight: 500 }}>
            {t('alreadyHaveAccountLogin') || 'Already have an account? Log in here.'}
          </a>
        </div>
      </Card>
    </div>
  );
};

export default SignUpForm; 