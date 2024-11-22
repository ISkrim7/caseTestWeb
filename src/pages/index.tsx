import TitleName from '@/components/TitleName';
import {
  HomeOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  SettingFilled,
  UserOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Image, Popover } from 'antd';

export default function IndexPage() {
  const book = (
    <a
      onClick={() => {
        window.open('https://5i5j.feishu.cn/wiki/wikcnQ5aGtmtu8YNBetcAjZn0ac');
      }}
    >
      文档手册
    </a>
  );

  const QR = (
    <Popover content={<Image width={400} src={'/icons/feishu.png'} />}>
      <a>群聊</a>
    </Popover>
  );
  const here = <a href={'/collect'}>这里</a>;
  return (
    <ProCard
      direction="column"
      gutter={[0, 16]}
      style={{ marginBlockStart: 5, overflow: 'auto', height: '100vh' }}
    >
      <ProCard gutter={24}>
        <p
          style={{
            display: 'block',
            fontSize: '30px',
            textAlign: 'center',
            color: 'orange',
          }}
        >
          欢迎来到爱家测试平台
        </p>
        <p
          style={{
            marginBottom: '10px',
            textAlign: 'center',
            display: 'block',
          }}
        >
          您是否因繁琐的数据录入和测试过程而感到疲惫？是否希望有一种更简便、更高效的方法来构造和处理数据？如果是，那么我们的平台就是您的解决方案！
        </p>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px' }}>为什么选择我们？</h3>
          <p>
            轻松构造数据：我们的平台具有自定义参数功能，可助您轻松完成诸如构造合同之类的任务，无需手动填充和处理数据。
          </p>
          <p>
            效率翻倍，工作轻松：通过我们的平台，您可以有效节省数据处理时间，减轻您的工作负担，从而专注于其他更重要的工作任务。
          </p>
          <p>
            它是针对您的需求而设计的：我们了解您的工作和需要。因此，我们的平台专为您提供了直观而易于使用的界面以及实用的功能。
          </p>
        </div>
        <h3 style={{ textAlign: 'center', fontSize: '20px' }}>如何开始？</h3>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>
          只需浏览我们的{book},
          您可以快速了解如何使用我们的平台。从生成您的第一个数据对象开始，到创建更复杂的数据结构，我们的指南将引导您完成所有工作。
          <br />
          加入我们的{QR}，在这里，您可以提出问题、分享经验和参与讨论,
          或者通过点击{here}直接提交
          <br />
          今天就开始使用我们的平台，体验工作的轻松和快速！
        </p>
      </ProCard>
      <ProCard style={{ marginBlockStart: 5 }} gutter={10}>
        <ProCard
          title={
            <>
              <HomeOutlined
                style={{ fontSize: '20px', marginRight: 10, color: 'orange' }}
              />
              {TitleName('房')}
            </>
          }
          style={{ borderRadius: '20px', height: '250px' }}
          colSpan={{
            sm: '33%',
            xl: '33%',
          }}
          hoverable
          bordered
        >
          <p>支持构造房源与楼盘库相关操作</p>
          <p>还可以做一些房源动作比如 录入钥匙、做委托等</p>
          <p>
            <a href={'/CBS/structure/house/newHouse'}>去添加房源或者楼盘</a>
          </p>
          <p>
            <a href={'/CBS/structure/house/job'}>去做一些房源动作</a>
          </p>
        </ProCard>
        <ProCard
          title={
            <>
              <UserOutlined
                style={{ fontSize: '20px', marginRight: 10, color: 'orange' }}
              />{' '}
              {TitleName('客')}
            </>
          }
          hoverable
          style={{ borderRadius: '20px', height: '250px' }}
          bordered
          colSpan={{
            sm: '33%',
            xl: '33%',
          }}
        >
          <p>支持添加一个客源或者带看</p>
          <p>还可以完成客源的委托书构造</p>
          <p>
            <a href={'/CBS/structure/custom/job'}>去添加</a>
          </p>
        </ProCard>
        <ProCard
          title={
            <>
              <ProfileOutlined
                style={{ fontSize: '20px', marginRight: 10, color: 'orange' }}
              />
              {TitleName('签约')}
            </>
          }
          style={{ borderRadius: '20px', height: '250px' }}
          colSpan={{
            sm: '33%',
            xl: '33%',
          }}
          hoverable
          bordered
        >
          <p>支持可选城市买卖租赁或者意向的草签合同录入</p>
          <p>也支持正式合同的一键收款收齐</p>
          <p>
            <a href={'/CBS/structure/sign/addContract'}>去录入个合同</a>
          </p>
          <p>
            <a href={'/CBS/structure/sign/job'}>去完成收款</a>
          </p>
        </ProCard>
      </ProCard>
      <ProCard style={{ marginBlockStart: 5 }} gutter={10}>
        <ProCard
          title={
            <>
              <SettingFilled
                style={{ fontSize: '20px', marginRight: 10, color: 'orange' }}
              />
              {TitleName('审批流')}
            </>
          }
          hoverable
          style={{ borderRadius: '20px', height: '250px' }}
          bordered
          colSpan={{
            sm: '33%',
            xl: '33%',
          }}
        >
          <p>
            这里做了一些审批流、发起后在这里可以一键审批通过、免去切换身份重复登录操作
          </p>
          <p>目前支持了业绩相关申请单、签约协议审批</p>
          <p>
            <a href={'/CBS/structure/approve'}>去审批</a>
          </p>
        </ProCard>
        <ProCard
          title={
            <>
              <ScheduleOutlined
                style={{ fontSize: '20px', marginRight: 10, color: 'orange' }}
              />
              {TitleName('敬请期待')}
            </>
          }
          style={{ borderRadius: '20px', height: '250px' }}
          colSpan={{
            sm: '33%',
            xl: '33%',
          }}
          bordered
          hoverable
        >
          <Image
            width={150}
            src={'/icons/qidai2.png'}
            preview={false}
            style={{ textAlign: 'center' }}
          ></Image>
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
