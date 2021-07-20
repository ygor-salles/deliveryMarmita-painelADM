interface ISizeProduct { name: string, size: string }

export default function getListSize(): ISizeProduct[] {
  return [
    { name: 'Marmita grande', size: 'grande' },
    { name: 'Marmita média', size: 'media' },
    { name: 'Marmita pequena', size: 'pequena' },
    { name: 'Bebida', size: null },
  ];
}
