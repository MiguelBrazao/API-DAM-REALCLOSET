import fs from 'fs'

export const convert = (name) => {
    try{

        const imagePath = './uploads/' + name;
        const imageBuffer = fs.readFileSync(imagePath);
        
       return imageBuffer.toString('base64');
    }catch(e){
        return ''
    }

}