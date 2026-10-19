// Hand-drawn 24×24 ingredient sprites. All pixels and colors are owned by the
// application, independent of OS fonts or emoji coverage. No image dependency.
import {mkdirSync,writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../dist/assets/ingredients/',import.meta.url));
mkdirSync(output,{recursive:true});
const N=24,O='#395347',W='#fff4d9',G='#72a45f',D='#426b48',L='#acd17c',Y='#e4bc70',B='#a47b4c';
let pixels;
function rect(x,y,w,h,c){const hex=c.slice(1),rgba=[parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16),255];for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){if(xx>=0&&xx<N&&yy>=0&&yy<N)pixels.set(rgba,(yy*N+xx)*4);}}
function bands(x,y,rows,c){rows.forEach(([offset,width],i)=>rect(x+offset,y+i,width,1,c));}
function blob(x,y,w,h,c){rect(x+2,y,w-4,h,c);rect(x,y+2,w,h-4,c);rect(x+1,y+1,w-2,h-2,c);}
function dots(points,c,size=1){for(const [x,y] of points)rect(x,y,size,size,c);}
function bottle(liquid,cap,label='#f3e7be'){
 rect(9,2,6,3,O);rect(10,2,4,2,cap);rect(10,5,4,4,O);rect(11,5,2,4,'#d2c492');
 blob(6,8,12,14,O);rect(7,10,10,10,liquid);rect(9,9,6,12,liquid);rect(8,10,2,9,'#ffffff');rect(8,10,1,9,'#f9e6b5');
 rect(8,13,8,5,label);rect(10,14,4,1,cap);rect(11,16,2,1,cap);
}
function bag(main,shade,labelColor){rect(6,3,12,2,O);rect(7,4,10,2,main);rect(7,6,10,2,O);blob(4,7,16,15,O);rect(5,9,14,11,main);rect(6,8,12,13,main);rect(16,9,3,11,shade);rect(7,11,8,7,labelColor);rect(9,13,4,1,shade);rect(10,15,2,1,shade);rect(6,20,12,1,shade);}
function jar(fill,lid,mark){rect(6,3,12,3,O);rect(7,3,10,2,lid);rect(7,6,10,2,O);blob(4,7,16,15,O);rect(5,9,14,11,fill);rect(6,8,12,13,fill);rect(6,9,2,10,'#e7d6a4');rect(8,12,8,6,W);rect(10,14,4,2,mark);}
const draw={
 tomato(){blob(3,6,18,16,O);blob(4,7,16,14,'#c95842');blob(5,7,13,12,'#ed7852');rect(6,9,4,2,'#ffb179');rect(5,11,2,4,'#ff9a68');rect(17,11,2,7,'#a94839');rect(8,5,9,2,D);rect(10,4,3,6,G);rect(7,6,4,2,G);rect(14,6,4,2,G);rect(13,2,2,4,O);rect(13,2,1,3,G);},
 egg(){bands(5,2,[[6,3],[5,5],[4,7],[3,9],[3,9],[2,11],[2,11],[1,13],[1,13],[0,15],[0,15],[0,15],[0,15],[0,15],[1,13],[1,13],[2,11],[3,9],[5,5]],O);blob(6,7,13,12,'#dfbf89');blob(8,4,9,15,'#f4dbaa');blob(7,8,11,10,'#f7e4b9');rect(9,6,3,9,W);rect(8,10,2,5,W);},
 broccoli(){rect(9,11,7,11,O);rect(10,12,5,9,'#9ac57a');rect(10,15,2,6,L);rect(13,14,2,7,G);rect(7,10,4,5,O);rect(8,10,3,4,G);blob(2,6,10,9,O);blob(3,7,9,7,D);blob(7,2,11,12,O);blob(8,3,9,10,G);blob(14,6,9,10,O);blob(15,7,7,8,G);blob(7,8,10,9,D);rect(9,6,3,2,L);rect(4,9,3,2,G);rect(16,9,3,2,L);rect(10,11,4,2,G);},
 garlic(){rect(11,2,3,6,O);rect(12,3,1,5,'#c4ae9b');blob(5,8,15,13,O);blob(4,10,17,9,O);blob(5,10,15,9,'#ded0bc');blob(8,7,10,13,'#f7ead2');rect(10,6,5,14,'#fff3dc');rect(9,10,1,8,'#bc9f9f');rect(15,9,1,9,'#c6abab');rect(7,12,1,5,'#bca7a5');rect(10,20,6,1,'#b7a18e');},
 mushroom(){rect(9,11,7,11,O);rect(10,12,5,9,'#ead6ae');rect(11,12,2,8,W);blob(2,3,20,13,O);blob(3,4,18,10,'#a56a46');blob(5,4,13,7,'#c48c59');rect(4,13,16,2,'#654b38');rect(7,6,3,2,'#f0c88e');rect(14,8,3,2,'#e9bb7c');rect(4,9,2,2,'#d6a369');},
 chicken(){rect(4,16,7,3,O);rect(6,14,6,6,O);rect(3,17,3,4,O);rect(4,18,2,2,W);rect(5,17,4,2,W);rect(7,15,3,3,W);blob(9,3,13,14,O);blob(8,6,13,12,O);blob(9,6,11,10,'#bf7650');blob(10,4,10,10,'#d78e61');rect(12,5,5,3,'#edb680');rect(10,8,2,4,'#e5a574');rect(16,13,3,2,'#a55c46');},
 tofu(){rect(4,6,14,14,O);rect(6,4,14,14,O);rect(5,7,12,12,'#e4c795');rect(7,5,12,12,W);rect(17,7,2,10,'#cfb17a');rect(5,17,12,2,'#d6b982');rect(7,7,2,3,'#fffbed');dots([[11,7],[15,9],[10,12],[14,14],[8,16]],'#e0cd9e');},
 scallion(){rect(7,16,3,7,O);rect(8,17,1,5,W);rect(12,14,3,8,O);rect(13,15,1,6,'#e2e3b8');for(let j=0;j<7;j++){rect(6-j%3,15-j*2,3,3,D);rect(7-j%3,15-j*2,1,2,L);rect(11+j,14-j*2,3,3,D);rect(12+j,14-j*2,1,2,G);}rect(8,13,3,4,G);rect(13,11,2,4,L);},
 rice(){blob(3,7,18,10,O);blob(4,6,16,10,'#e8ddbb');blob(6,4,12,10,W);dots([[7,6],[11,5],[15,7],[5,9],[10,9],[16,10],[12,12]],'#c4b793');rect(2,13,20,3,O);rect(3,14,18,3,'#e3aa76');rect(4,17,16,2,O);rect(5,17,14,2,'#cb865f');rect(6,19,12,2,O);rect(8,21,8,1,O);},
 seaweed(){blob(4,4,16,16,O);rect(5,4,13,15,'#3e6953');rect(4,7,14,10,'#52764c');rect(7,2,4,18,'#527d51');rect(13,5,5,15,'#2e5849');rect(5,7,2,7,'#7c9b5d');rect(10,5,2,12,'#78955a');rect(16,7,1,10,'#78955a');rect(8,19,9,2,O);},
 mince(){blob(2,7,20,14,O);blob(3,8,18,11,'#cdd6bf');blob(4,6,16,13,'#c77f6c');blob(6,4,12,14,'#e2a28b');dots([[7,6],[10,8],[15,6],[17,10],[6,12],[10,13],[14,15],[16,12]],'#ad695d',2);dots([[7,9],[12,5],[13,11],[8,15]],'#f3c6a4',2);rect(5,19,14,1,'#b2c3a4');},
 salt(){rect(7,2,10,5,O);rect(8,3,8,3,'#899f9c');dots([[9,3],[12,3],[15,3]],'#d7e1cd');blob(5,7,14,15,O);rect(6,9,12,11,'#d7dfcf');rect(7,8,10,13,'#eaf0d9');rect(7,10,2,8,W);rect(8,13,8,5,'#9ab4aa');dots([[10,14],[13,15],[11,16]],W);},
 oil(){bottle('#e8b953','#68805b');},
 ginger(){blob(3,8,13,10,O);blob(6,5,6,16,O);blob(12,10,9,8,O);blob(15,4,5,11,O);rect(5,9,10,7,Y);rect(7,6,4,14,Y);rect(13,11,6,6,Y);rect(16,5,3,10,Y);rect(5,10,3,2,'#f5d994');rect(8,7,2,3,'#f5d994');rect(16,6,2,4,'#f5d994');dots([[8,13],[13,14],[17,12],[9,17]],'#b38e54');},
 sugar(){bag('#c3d9d6','#88aba9',W);},
 soy(){bottle('#7f5844','#bd684b');},
 starch(){bag('#bed3a1','#7f9e6a',W);},
 sesameOil(){bottle('#b88b42','#9f6750');dots([[10,14],[13,14],[12,16]],'#91683c');},
 beanPaste(){jar('#a76143','#b98149','#bd6143');},
 pepper(){jar('#ad8e64','#6e7961','#7c5c42');},
 carrot(){rect(10,5,4,3,O);for(let j=0;j<7;j++){rect(6+j,8+j*2,12-j*2,2,O);if(j<5)rect(7+j,8+j*2,10-j*2,2,'#e49b4f');}rect(8,9,3,3,'#f3ba69');dots([[13,12],[11,16]],'#bd783f',2);rect(11,1,2,6,D);rect(7,2,3,3,G);rect(9,4,3,3,G);rect(14,3,3,3,G);},
 onion(){rect(11,2,3,5,O);rect(12,3,1,4,'#af9379');blob(3,8,18,13,O);blob(5,6,14,15,'#b28f9b');blob(6,8,12,11,'#d6b3bd');rect(10,6,5,14,'#edd5cf');rect(8,9,1,9,'#ae7e93');rect(15,9,1,9,'#ae7e93');rect(7,12,1,4,'#e8c7ce');},
 potato(){blob(3,6,18,14,O);blob(4,7,16,12,'#c59c60');blob(4,7,13,10,'#dec18a');rect(7,8,4,2,'#eddaa5');dots([[14,9],[7,13],[16,14],[11,16]],'#a98752');},
 cabbage(){blob(3,3,18,19,O);blob(4,4,16,17,G);blob(7,5,11,15,L);rect(10,6,4,15,'#c3d595');rect(11,8,2,13,'#e5e8bc');for(let j=0;j<4;j++){rect(6+j,9+j*2,3,2,D);rect(15-j,8+j*2,3,2,G);}rect(7,18,3,2,D);},
 cucumber(){for(let j=0;j<8;j++){blob(4+j,17-j*2,7,6,O);blob(5+j,17-j*2,5,4,G);}rect(14,2,3,2,L);dots([[8,16],[11,12],[13,7],[9,14]],'#c0d384');},
 greens(){blob(3,2,9,14,O);blob(4,3,7,12,G);blob(11,4,10,13,O);blob(12,5,8,11,L);rect(9,10,3,12,O);rect(10,11,1,10,'#d8ddb0');rect(13,11,3,10,O);rect(14,12,1,8,'#cfdd9b');rect(6,5,2,7,L);rect(15,7,2,6,G);},
 fish(){blob(3,6,15,12,O);blob(4,7,13,10,'#94b9ae');rect(7,7,8,3,'#bbd3bd');rect(6,10,8,5,'#76a29b');rect(17,8,3,8,O);rect(20,5,2,14,O);rect(18,9,3,6,'#83b0a3');rect(5,10,2,2,O);rect(5,10,1,1,W);rect(8,17,5,2,O);rect(10,5,4,2,O);rect(12,7,1,10,'#628f8a');},
 shrimp(){blob(5,3,15,9,O);blob(6,4,13,7,'#e5a38a');rect(7,4,8,2,'#f2c3a0');rect(3,8,7,10,O);rect(4,9,5,8,'#df9277');rect(5,16,12,5,O);rect(6,17,10,3,'#e8ad91');rect(15,14,5,7,O);rect(16,15,3,5,'#c97e69');dots([[10,7],[13,7],[6,11],[6,14]],'#b86e5b');rect(17,6,1,2,O);},
 beef(){blob(3,5,18,15,O);blob(4,6,16,13,'#d7b59c');blob(5,7,14,11,'#b86152');rect(7,8,3,3,'#d58e76');rect(12,11,4,3,'#e7b99a');rect(10,9,2,2,W);rect(14,9,2,2,'#9b4f45');rect(8,14,2,3,'#dfa68b');},
 pork(){blob(3,5,18,15,O);blob(4,6,16,13,'#f0c9ad');blob(5,7,14,10,'#d99882');rect(13,9,3,6,'#edd0b2');rect(9,11,5,2,'#edd0b2');rect(11,10,2,4,W);rect(6,8,3,3,'#e8b59a');},
 pepperVegetable(){rect(11,2,3,6,O);rect(12,3,1,5,G);blob(4,7,16,14,O);blob(5,8,14,12,'#5e8e51');rect(7,9,4,11,G);rect(12,8,5,12,'#86b36b');rect(7,10,2,4,L);rect(11,9,1,9,D);},
 generic(){bag('#d9bd8a','#b19464',W);rect(9,13,5,1,G);rect(11,11,1,5,G);},
 pot(){rect(8,3,8,2,O);rect(9,3,6,1,G);rect(6,5,12,2,O);rect(3,7,18,3,O);rect(4,8,16,1,'#c2d0b1');rect(1,11,4,4,O);rect(19,11,4,4,O);rect(3,10,18,10,O);rect(4,11,16,8,'#789879');rect(5,11,3,7,'#a6bb91');rect(7,20,10,1,O);rect(7,12,10,1,'#426b48');},
 plate(){blob(2,3,20,18,O);blob(3,4,18,16,'#b8cbb1');blob(5,6,14,12,W);blob(7,8,10,8,'#e5dfb9');rect(10,10,4,3,'#f4eaca');}
};
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1;}return (crc^0xffffffff)>>>0;}
function chunk(name,data){const type=Buffer.from(name),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([type,data])));return Buffer.concat([size,type,data,crc]);}
function png(){const header=Buffer.alloc(13);header.writeUInt32BE(N,0);header.writeUInt32BE(N,4);header[8]=8;header[9]=6;const raw=Buffer.alloc((N*4+1)*N);for(let y=0;y<N;y++)Buffer.from(pixels.subarray(y*N*4,(y+1)*N*4)).copy(raw,y*(N*4+1)+1);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
for(const [name,paint] of Object.entries(draw)){pixels=new Uint8Array(N*N*4);paint();writeFileSync(output+name+'.png',png());}
console.log(`Created ${Object.keys(draw).length} pixel PNG icons in dist/assets/ingredients/`);
