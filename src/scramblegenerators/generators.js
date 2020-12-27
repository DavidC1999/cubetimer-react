import Generator2x2 from './Generator2x2';

const generators = {
    '2x2': Generator2x2,
    '3x3': Generator2x2
};

export default function getGenerator(name) {
    return new generators[name]()
}