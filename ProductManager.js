const fs = require('fs')

class ProductManager {
    constructor() {
        this.products = []
        this.productCount = 0
        this.path = "./files/productos.json"
        this.readFile()
    }

    readFile(){
        try {
            if (fs.existsSync(this.path)) {
                const fileContent = fs.readFileSync(this.path, 'utf-8')
                const data = JSON.parse(fileContent)
                this.products= data.productsList
                this.productCount = data.index
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    writeFile(){
        const data= { index : this.productCount, productsList : this.products }
        try {
            fs.writeFileSync(this.path, JSON.stringify(data),'utf-8')
        } catch (error) {
            console.log(error)
        }
    }


    addProduct(prodToAdd) {
    
        if (this.validProduct(prodToAdd)) {
            this.productCount+=1;
            let newProduct = prodToAdd
            newProduct.id =  this.productCount
            // agregar el producto
            this.products.push(newProduct)
            // console.log(this.products)
            console.log("El codigo ",newProduct.code," fue agregado exitosamente.");
            this.writeFile()

        }
    }

    updateProduct(id, updatedProduct){
        // obtengo el index del elemento.
        const prodIndex=this.products.findIndex(prod=>prod.id==id)
        if (prodIndex !== -1) {
            delete updatedProduct.id  //Si updatedProduct trae un id, lo borro.
            this.products[prodIndex] = { ...this.products[prodIndex], ...updatedProduct }
            console.log("El producto "+this.products[prodIndex].code+" "+this.products[prodIndex].title+" fue actualizado exitosamente.");
            this.writeFile()
        } else {
            console.log("No existe producto con id "+id);
        }
    }
    
    validProduct(prodToVerify) {
        let returnValue= true
        let logMessage= "Se han encontrado los siguientes errores: \n"
        
        // Evaluo si el codigo existe.
        const codeExist= this.products.find(prod => prod.code ==prodToVerify.code);
        if (!(codeExist===undefined)) {
           // retornar error El codigo existe
           logMessage+= "- El codigo "+prodToVerify.code+" ya existe.\n"
           returnValue=false
        }
        // evaluo si title esta vacio o undefined
        if (!prodToVerify.title) {
            logMessage+= "- No ha especificado el titulo (title) del producto.\n"
            returnValue=false
        }
        // evaluo si descripcion esta vacio o undefined
        if (!prodToVerify.description) {
            logMessage+= "- No ha especificado la descripcion (description) del producto.\n"
            returnValue=false
        }
        // evaluo si thumbnail esta vacio o undefined
        if (!prodToVerify.thumbnail) {
            // Personalemente usaria valor por defecto "Sin imagen", pero ordenes son ordenes...
            logMessage+= "- No ha especificado el archivo de imagen (thumbnail) del producto.\n"
            returnValue=false
        }
        // evaluo si code esta vacio o undefined
        if (!prodToVerify.code) {
            logMessage+= "- No ha especificado el código (code) del producto.\n"
            returnValue=false
        }
        // evaluo si price es undefined  
        if (prodToVerify.price===undefined) {
            logMessage+= "- No ha especificado el precio (price) del producto.\n"
            returnValue=false
        }
        // evaluo si stock esta vacio
        if (prodToVerify.stock===undefined) {
            logMessage+= "- No ha especificado el stock del producto.\n"
            returnValue=false
        }
        returnValue || console.log(logMessage)
        return returnValue
    }

    getProductById(id) {
        // Retorna el producto buscado o undefined.
        const searchedCode = this.products.find(prod => prod.id ==id)
        if (searchedCode===undefined) {
            return "id "+id+" Not Found"
        }
        return searchedCode
    }

    deleteProductById(id){
        // obtengo el index del elemento.
        const prodIndex=this.products.findIndex(prod=>prod.id==id)
        if (prodIndex !== -1) {
            const deletedCode= this.products[prodIndex].code
            const deletedTitle=this.products[prodIndex].title
            this.products.splice(prodIndex,1)
            // console.log(this.products)
            console.log("El producto "+deletedCode+" "+deletedTitle+" fue eliminado exitosamente.");
            this.writeFile()
        } else {
            console.log("No existe producto con id "+id);
        }
    }

    getProducts() {
        // Devuelve el arreglo completo de productos
        return this.products
    }

    listProducts(){
        this.products.forEach((product) => {
            console.log(`${product.title} ... $${product.price}`);
          });
    }
        
}


const obj={ title: "producto prueba",
description : "Este es un producto prueba",
price: 200,
thumbnail : "Sin imagen",
code: "abc123",
stock: 25 }

const obj2={ 
    id:20,
    price: 700,
    stock: 70 }

// ****  TESTING ******************
const pm = new ProductManager
pm.getProducts()
pm.addProduct(obj)
pm.getProducts()
pm.updateProduct(1,obj2)
console.log(pm.getProductById(20))
console.log(pm.getProductById(1))
pm.deleteProductById(1)
pm.listProducts()