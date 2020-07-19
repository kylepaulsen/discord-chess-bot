import nodeCanvas from 'canvas';

export const images = {};

export const pieces = ['wking', 'wqueen', 'wbishop', 'wknight',
    'wrook', 'wpawn', 'bking', 'bqueen', 'bbishop', 'bknight', 'brook', 'bpawn'];

const imagesToLoad = pieces.concat('board');

export const loadImages = () => {
    let completed = 0;
    return new Promise(res => {
        imagesToLoad.forEach(name => {
            nodeCanvas.loadImage(`images/${name}.png`).then(image => {
                images[name] = image;
                completed++;
                if (completed >= imagesToLoad.length) {
                    res(images);
                }
            });
        });
    });
};
