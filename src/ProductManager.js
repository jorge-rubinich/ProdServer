const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.products = []
        this.productCount = 0
        this.path = path
    }

    //
    readProducts = async ()=>{
        try {
            if (fs.existsSync(this.path)) {
                const fileContent = await fs.promises.readFile(this.path, 'utf-8')
                const data = JSON.parse(fileContent)
                this.products= data.productsList
                this.productCount = data.index
            }
        } catch (error) {
            console.log(error)
        }
        return this.products
    }


    getProducts = async (limite)=>{
        const products = await this.readProducts()
        if (Array.isArray(products)) {
            if (limite==0) { limite= this.products.length}
            return {status: 'ok', data: this.products.slice(0,limite)}
        } else {
            return {status: 'error', data: 'no se ha recibido una respuesta correcta de la base de datos.'}
        }
    }

    writeFile = async ()=>{
        const data= { index : this.productCount, productsList : this.products }
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data),'utf-8')
        } catch (error) {
            console.log(error)
        }
    }


    addProduct= async (prodToAdd) =>{
        await this.readProducts()

        const valid=this.validProduct(prodToAdd)
        console.log(valid)
        if (valid.length==0) {
            this.productCount+=1;
            let newProduct = prodToAdd
            newProduct.id =  this.productCount
            // agregar el producto
            this.products.push(newProduct)
            await  this.writeFile()
            return {status:'ok', data:'producto id '+newProduct.id+' agregado.'}
        }
        return {status: 'error', data: valid}
    }

    updateProduct= async (id, updatedProduct)=>{
        await this.readProducts()
        // obtengo el index del elemento.
        const prodIndex=this.products.findIndex(prod=>prod.id==id)
        if (prodIndex !== -1) {
            console.log(updatedProduct)
            id in updatedProduct |  delete updatedProduct.id  //Si updatedProduct trae un id, lo borro.
            this.products[prodIndex] = { ...this.products[prodIndex], ...updatedProduct }
            await this.writeFile()
            return {status:'ok', data:'producto id '+id+' modificado exitosamente.'}
        }
        return {status: 'error', data:  "No existe producto con id "+id}
    }
    
    validProduct(prodToVerify) {
        let returnValue= true
        const errores = []
        
        // Evaluo si el codigo existe.
        console.log(prodToVerify.code)
        const codeExist= this.products.find(prod => prod.code ==prodToVerify.code);
        console.log(codeExist)
        console.log("xxx")
        if (!(codeExist===undefined)) {
           // retornar error El codigo existe
           errores.push("- El codigo "+prodToVerify.code+" ya existe.")
           returnValue=false
        }
        // evaluo si title esta vacio o undefined
        if (!prodToVerify.title) {
            errores.push("- No ha especificado el titulo (title) del producto.")
            returnValue=false
        }
        // evaluo si descripcion esta vacio o undefined
        if (!prodToVerify.description) {
            errores.push("- No ha especificado la descripcion (description) del producto")
            returnValue=false
        }
        // evaluo si thumbnail esta vacio o undefined
        if (!prodToVerify.thumbnail) {
            // Personalemente usaria valor por defecto "Sin imagen", pero ordenes son ordenes...
            errores.push("- No ha especificado el archivo de imagen (thumbnail) del producto")
            returnValue=false
        }
        // evaluo si code esta vacio o undefined
        if (!prodToVerify.code) {
            errores.push("- No ha especificado el código (code) del producto")
            returnValue=false
        }
        // evaluo si price es undefined  
        if (prodToVerify.price===undefined) {
            errores.push("- No ha especificado el precio (price) del producto")
            returnValue=false
        }
        // evaluo si stock esta vacio
        if (prodToVerify.stock===undefined) {
            errores.push("- No ha especificado el stock del producto")
            returnValue=false
        }
        
        return errores
    }

    async getProductById(id) {
        // Retorna el producto buscado o undefined.
        const products = await this.readProducts()
        const searchedCode = products.find(prod => prod.id ==id)
        if (searchedCode) {
            return {status:'ok', data: searchedCode}
        }
        return {status: 'error', data:  "No existe producto con id "+id}
    }

    async deleteProductById(id){
        const products = await this.readProducts()
        // obtengo el index del elemento.
        const prodIndex=products.findIndex(prod=>prod.id==id)
        if (prodIndex !== -1) {
            const deletedCode= products[prodIndex].code
            products.splice(prodIndex,1)
            this.writeFile()     
            return {status:'ok', data:'producto id '+id+' eliminado exitosamente.'}
        }
        return {status: 'error', data:  "No existe producto con id "+id}
    }
        
}


module.exports = ProductManager

/* const obj={ title: "producto prueba",
description : "Este es un producto prueba",
price: 200,
thumbnail : "Sin imagen",
code: "abc123",
stock: 25 }

const obj2={ 
    id:20,
    price: 700,
    stock: 70 } */

// ****  TESTING ******************
/*const pm = new ProductManager
console.log(pm.getProducts())
pm.addProduct(obj)
pm.getProducts()
pm.updateProduct(1,obj2)
console.log(pm.getProductById(20))
console.log(pm.getProductById(1))
pm.deleteProductById(1)
pm.listProducts()
 */