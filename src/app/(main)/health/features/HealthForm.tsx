'use client';

import { useUser } from '@clerk/nextjs';
import { Form, type FormProps, Input } from '@lobehub/ui';
import { Button, InputNumber, Select, notification } from 'antd';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

// 引入 useRouter

const useStyles = createStyles(({ css, responsive }) => ({
  title: css`
    margin-block-start: 0.5em;
    font-size: 24px;
    font-weight: 600;
    ${responsive.mobile} {
      font-size: 20px;
    }
  `,
}));

const setting = {
  age: '',
  gender: '',
  goal: '',
  height: '',
  weight: '',
};

const Page = () => {
  const { t } = useTranslation('healthform');
  const { styles } = useStyles();
  const [form] = Form.useForm(); // 创建 form 实例
  const { user } = useUser();
  const router = useRouter();
  // 表单提交处理
  const items: FormProps['items'] = [
    {
      children: <Input size="large" type="ghost" />,
      // desc: 'Fill out Age',
      label: t('title.age'),
      minWidth: '290px',
      name: 'age',
      rules: [{ message: 'Please enter your age', required: true }], // 必填验证
    },
    {
      children: (
        <Select
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />
      ),
      // desc: 'Choose your Gender',
      label: t('title.gender'),
      name: 'gender',
      rules: [{ message: 'Please select your gender', required: true }], // 必填验证
    },
    {
      children: <InputNumber style={{ width: 290 }} />,
      // desc: 'Please enter your height (cm)',
      label: t('title.height'),
      name: 'height',
      rules: [{ message: 'Please enter your height', required: true }], // 必填验证
    },
    {
      children: <InputNumber style={{ width: 290 }} />,
      // desc: 'Please enter your weight (kg)',
      label: t('title.weight'),
      name: 'weight',
      rules: [{ message: 'Please enter your weight', required: true }], // 必填验证
    },
    {
      children: <Input />,
      // desc: 'Please enter your health Goal',
      label: t('title.goal'),
      name: 'goal',
      rules: [{ message: 'Please enter your goal', required: true }], // 必填验证
    },
  ];

  // eslint-disable-next-line unicorn/consistent-function-scoping, unused-imports/no-unused-vars
  const handleFinish = async (values: any) => {
    console.log('表单提交的数据:', values);
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: {
          age: values.age,
          gender: values.gender,
          goal: values.goal,
          height: values.height,
          weight: values.weight,
        },
      });
      console.log('User metadata updated successfully');
      // 成功提示
      notification.success({
        description: t('title.message'),
        message: t('title.thanks'),
      });
      // 跳转到 /welcome 页面
      router.push('/welcome');
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };
  return (
    <Flexbox direction="vertical" gap={16}>
      <h2 className={styles.title}>{t(`title.fill`)}</h2>
      <Form
        footer={
          <>
            <Button block htmlType="submit" type="primary">
              Submit
            </Button>
            <Button block onClick={() => form.resetFields()}>
              Reset
            </Button>
          </>
        }
        form={form} // 将 form 实例传递给 Form 组件
        initialValues={setting}
        itemMinWidth={'max(30%,240px)'}
        items={items}
        itemsType={'flat'}
        onFinish={handleFinish}
      />
    </Flexbox>
  );
};

Page.displayName = 'HealthForm';

export default Page;
