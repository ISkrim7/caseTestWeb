import { IObjGet } from '@/api';

const HouseOwn = (city: string): { label: string; value: number }[] => {
  const cityMap: IObjGet = {
    beijing: [
      { value: '1', label: '商品房' },
      { value: '2', label: '已购公房成本价非央产' },
      {
        value: '3',
        label: '已购公房成本价央产',
      },
      { value: '21', label: '已购公房优惠价/标准价央产' },
      {
        value: '23',
        label: '已购公房优惠价/标准价非央产',
      },
      { value: '4', label: '一类经适房' },
      {
        value: '6',
        label: '二类经适房（经管房）',
      },
      { value: '7', label: '按商品房管理' },
      { value: '8', label: '自住商品房' },
      {
        value: '9',
        label: '限价商品房',
      },
      { value: '10', label: '共有产权房' },
      { value: '12', label: '定向安置房' },
      {
        value: '5',
        label: '集体产权',
      },
      { value: '11', label: '其他' },
    ],
    shanghai: [
      { value: '8', label: '自住商品房' },
      { value: '9', label: '限价商品房' },
      {
        value: '5',
        label: '集体产权',
      },
      { value: '11', label: '其他' },
      {
        value: '40',
        label: '已购公房（售后公房）',
      },
      { value: '41', label: '使用权房' },
      { value: '42', label: '经济适用房' },
      {
        value: '43',
        label: '商品住房',
      },
      { value: '44', label: '非居住用房' },
      { value: '45', label: '工业厂房' },
      {
        value: '46',
        label: '车库',
      },
      { value: '47', label: '办公楼' },
      { value: '48', label: '动迁安置房' },
    ],
    tianjin: [
      { value: '1', label: '商品房' },
      { value: '8', label: '自住商品房' },
      {
        value: '9',
        label: '限价商品房',
      },
      { value: '5', label: '集体产权' },
      { value: '11', label: '其他' },
      {
        value: '41',
        label: '使用权房',
      },
      { value: '42', label: '经济适用房' },
      { value: '44', label: '非居住用房' },
      {
        value: '45',
        label: '工业厂房',
      },
      { value: '46', label: '车库' },
      { value: '47', label: '办公楼' },
      {
        value: '49',
        label: '乡产',
      },
      { value: '50', label: '央产' },
      { value: '51', label: '小产权' },
      {
        value: '52',
        label: '政策性保障住房',
      },
      { value: '53', label: '宗教产权' },
      { value: '54', label: '公产房' },
      {
        value: '55',
        label: '私产',
      },
      { value: '56', label: '企业产权' },
      { value: '57', label: '军用产权' },
      {
        value: '58',
        label: '已购公房',
      },
    ],
    taiyuan: [
      { value: '1', label: '商品房' },
      { value: '8', label: '自住商品房' },
      {
        value: '9',
        label: '限价商品房',
      },
      { value: '12', label: '定向安置房' },
      { value: '5', label: '集体产权' },
      {
        value: '11',
        label: '其他',
      },
      { value: '41', label: '使用权房' },
      { value: '42', label: '经济适用房' },
      {
        value: '49',
        label: '乡产',
      },
      { value: '50', label: '央产' },
      { value: '51', label: '小产权' },
      {
        value: '52',
        label: '政策性保障住房',
      },
      { value: '53', label: '宗教产权' },
      { value: '54', label: '公产房' },
      {
        value: '55',
        label: '私产',
      },
      { value: '56', label: '企业产权' },
      { value: '57', label: '军用产权' },
      {
        value: '58',
        label: '已购公房',
      },
    ],
    hangzhou: [
      { value: '1', label: '商品房' },
      { value: '11', label: '其他' },
      {
        value: '42',
        label: '经济适用房',
      },
      { value: '61', label: '解困房' },
      { value: '64', label: '存量房' },
      {
        value: '65',
        label: '房改房',
      },
      { value: '66', label: '拆迁回迁房' },
      { value: '67', label: '无证' },
    ],
    wuxi: [
      { value: '1', label: '商品房' },
      { value: '8', label: '自住商品房' },
      {
        value: '9',
        label: '限价商品房',
      },
      { value: '12', label: '定向安置房' },
      { value: '5', label: '集体产权' },
      {
        value: '11',
        label: '其他',
      },
      { value: '42', label: '经济适用房' },
      { value: '55', label: '私产' },
      {
        value: '57',
        label: '军用产权',
      },
      { value: '58', label: '已购公房' },
      { value: '60', label: '安居房' },
      {
        value: '61',
        label: '解困房',
      },
      { value: '63', label: '定销商品房' },
    ],
    zhengzhou: [
      { value: '1', label: '商品房' },
      { value: '8', label: '自住商品房' },
      {
        value: '9',
        label: '限价商品房',
      },
      { value: '5', label: '集体产权' },
      { value: '11', label: '其他' },
      {
        value: '41',
        label: '使用权房',
      },
      { value: '42', label: '经济适用房' },
      { value: '49', label: '乡产' },
      {
        value: '50',
        label: '央产',
      },
      { value: '52', label: '政策性保障住房' },
      { value: '55', label: '私产' },
      {
        value: '58',
        label: '已购公房',
      },
    ],
    nanjing: [
      { value: '1', label: '商品房' },
      { value: '11', label: '其他' },
      {
        value: '41',
        label: '使用权房',
      },
      { value: '42', label: '经济适用房' },
      { value: '50', label: '央产' },
      {
        value: '51',
        label: '小产权',
      },
      { value: '52', label: '政策性保障住房' },
      { value: '57', label: '军用产权' },
      {
        value: '58',
        label: '已购公房',
      },
    ],
  };
  return cityMap[city];
};
export default HouseOwn;
