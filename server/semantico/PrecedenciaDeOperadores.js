module.exports = [
  {
    operadores: ['-u', '+u', 'nao'],
    prioridade: 7,
  },
  {
    operadores: ['*', 'div'],
    prioridade: 6,
  },
  {
    operadores: ['-', '+'],
    prioridade: 5,
  },
  {
    operadores: ['>', '>=', '<', '<='],
    prioridade: 4,
  },
  {
    operadores: ['=', '!='],
    prioridade: 3,
  },
  {
    operadores: ['e'],
    prioridade: 2,
  },
  {
    operadores: ['ou'],
    prioridade: 1,
  },
];
