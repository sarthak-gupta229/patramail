'use strict';

module.exports = {
  product: { name: 'Acme Supply', link: 'https://acme.test' },
  subject: 'Your receipt for order #1042',
  preheader: 'Five items from Acme Supply.',
  body: {
    greeting: 'Thanks,',
    name: 'Jane',
    intro: 'We received payment for order #1042.',
    table: {
      data: [
        {
          Item: 'Notebook',
          Quantity: 2,
          'Unit price': '$6.00',
          Amount: '$12.00',
        },
        {
          Item: 'Pencil set',
          Quantity: 1,
          'Unit price': '$8.00',
          Amount: '$8.00',
        },
        { Item: 'Ruler', Quantity: 1, 'Unit price': '$3.00', Amount: '$3.00' },
        { Item: 'Eraser', Quantity: 2, 'Unit price': '$2.00', Amount: '$4.00' },
        { Item: 'Folder', Quantity: 1, 'Unit price': '$5.00', Amount: '$5.00' },
      ],
      columns: { customWidth: { Item: '34%', Quantity: '20%', Amount: '20%' } },
      total: { Item: 'Total', Amount: '$32.00' },
    },
    outro: 'Keep this receipt for your records.',
  },
  footer: {
    links: [{ text: 'Contact support', link: 'mailto:support@acme.test' }],
  },
};

if (require.main === module) {
  const PatraMail = require('..');
  console.log(new PatraMail().generateHtml(module.exports));
}
