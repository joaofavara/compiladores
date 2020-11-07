module.exports = [
  {
    operadores: ['-u', '+u', 'not'],
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
    operadores: ['and'],
    prioridade: 2,
  },
  {
    operadores: ['or'],
    prioridade: 1,
  },
];
