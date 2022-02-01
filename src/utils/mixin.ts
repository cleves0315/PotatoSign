import { Sign } from '../types/sign';

const defaultSign: [Sign] = [
  {
    id: '001',
    name: '默认书签',
    list: [],
    type: 'folder',
  },
];

const defaultSignMap = { '001': 0 };

const signTmpl = {
  id: '',
  name: '',
  list: [],
  type: 'folder',
};

export { defaultSign, defaultSignMap, signTmpl };
