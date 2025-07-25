import { BugOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Result, Typography } from 'antd';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    // 这里可以添加错误上报逻辑
    // reportErrorToServer(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          <Result
            status="error"
            title="应用发生错误"
            subTitle="抱歉，发生了意外错误，我们的技术团队已收到通知"
            extra={[
              <Button
                type="primary"
                key="retry"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
              >
                重试
              </Button>,
              <Button
                key="feedback"
                icon={<BugOutlined />}
                onClick={() => window.location.reload()}
              >
                刷新页面
              </Button>,
            ]}
          />
          <Card title="错误详情" style={{ marginTop: '24px' }}>
            <Typography.Text type="danger">
              {this.state.error?.toString()}
            </Typography.Text>
            <Typography.Paragraph>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </Typography.Paragraph>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
