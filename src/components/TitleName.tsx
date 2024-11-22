const TitleName = (name: string, style?: any) => {
  return (
    <span
      style={{
        fontWeight: 'bold',
        fontSize: '20px',
        color: 'orange',
        ...style,
      }}
    >
      {name}
    </span>
  );
};
export default TitleName;
