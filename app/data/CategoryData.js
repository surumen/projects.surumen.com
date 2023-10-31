import { v4 as uuid } from 'uuid';

export const CategoryData = [
    {
        id: uuid(),
        title: 'Python',
        color_scheme: 'green'
    },
    {
        id: uuid(),
        title: 'React',
        color_scheme: 'cyan'
    },
    {
        id: uuid(),
        title: 'Angular',
        color_scheme: 'orange'
    },
    {
        id: uuid(),
        title: 'Vue',
        color_scheme: 'teal'
    },
    {
        id: uuid(),
        title: 'NodeJS',
        color_scheme: 'charcoal-gray'
    },
    {
        id: uuid(),
        title: 'Machine Learning',
        color_scheme: 'dark-orange'
    },
];

export default CategoryData;