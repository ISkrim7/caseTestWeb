import Icon from '@ant-design/icons';

const SwaggerImageIcon = () => (
  <img
    src={'/icons/swagger.png'}
    alt="Swagger Icon"
    style={{ width: '24px', height: '24px' }}
  />
);
const PostManImageIcon = () => (
  <img
    src={'/icons/postman.jpeg'}
    alt="postman Icon"
    style={{ width: '24px', height: '24px' }}
  />
);
export const SwaggerIcon = () => {
  return <Icon component={SwaggerImageIcon} />;
};

export const PostManIcon = () => {
  return <Icon component={PostManImageIcon} />;
};
export const ApiPostIcon = () => {
  return (
    <Icon
      component={() => (
        <img
          src={'/icons/ApiPost.jpeg'}
          alt="ApiPost Icon"
          style={{ width: '24px', height: '24px' }}
        />
      )}
    />
  );
};

export const YAPIIcon = () => {
  return (
    <Icon
      component={() => (
        <img
          src={'/icons/yapi.png'}
          alt="YAPIIcon Icon"
          style={{ width: '24px', height: '24px' }}
        />
      )}
    />
  );
};
