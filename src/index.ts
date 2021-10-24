const $botonStart = document.getElementById('bottonEntrada')
const $inputDatos: any = document.getElementById('entradaDeTexto')
const $errorTitle: any = document.getElementById('textError')

const nodoInicial = -1
const nodoFinal = -2

class Nodo {
  esInicial: boolean
  esFinal: boolean
  esDesechado: boolean
  fda: FDAContatenacion | FDASimple | FDAUnion
  constructor (datos: {
    esInicial: boolean
    esFinal: boolean
    esDesechado: boolean
    fda: FDAContatenacion | FDASimple | FDAUnion
  }) {
    this.esInicial = datos.esInicial
    this.esFinal = datos.esFinal
    this.fda = datos.fda
    this.esDesechado = datos.esDesechado
  }

  setNodoDerecha (): any {}
  setNodoIzquierda (): any {}
}

interface FDA {
  setNodoDerecha(nodoDerecha: Nodo | FDAContatenacion | FDASimple): any
  setNodoIzquierda(nodoIzquierda: Nodo | FDAContatenacion | FDASimple): any
}

class FDASimple implements FDA {
  caracter: string

  nodoDerecha: Nodo | FDAContatenacion | FDASimple = new Nodo({
    esInicial: false,
    esFinal: true,
    esDesechado: false,
    fda: this
  })

  constructor (caracter: string) {
    this.caracter = caracter
  }
  setNodoDerecha (nodoDerecha: Nodo | FDAContatenacion | FDASimple): any {
    this.nodoDerecha = nodoDerecha
  }
  setNodoIzquierda (): any {}
}

class FDAContatenacion implements FDA {
  caracter: string
  nodoIzquierda: FDASimple | FDAContatenacion | Nodo
  nodoDerecha: FDASimple | FDAContatenacion | Nodo

  constructor (
    caracter: string,
    nodoIzquierda: FDASimple | FDAContatenacion,
    nodoDerecha: FDASimple | FDAContatenacion
  ) {
    this.caracter = caracter
    nodoIzquierda.setNodoDerecha(nodoDerecha)
    this.nodoIzquierda = nodoIzquierda
    this.nodoDerecha = nodoDerecha
  }
  setNodoIzquierda (nodoIzquierda: Nodo | FDAContatenacion | FDASimple) {
    this.nodoIzquierda = nodoIzquierda
  }
  setNodoDerecha (nodoDerecha: Nodo | FDAContatenacion | FDASimple) {
    this.nodoDerecha = nodoDerecha
  }
}

class FDAUnion implements FDA {
  caracter: string
  //Arriba
  nodoAbajo: FDASimple | FDAContatenacion | Nodo
  nodoArriba: FDASimple | FDAContatenacion | Nodo
  //Abajo

  nodoDerecha: FDASimple | FDAContatenacion | FDAUnion | Nodo = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })

  nodoIzquierda: FDASimple | FDAContatenacion | FDAUnion | Nodo = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  constructor (
    caracter: string,
    nodoArriba: FDASimple | FDAContatenacion,
    nodoAbajo: FDASimple | FDAContatenacion
  ) {
    this.caracter = caracter
    this.nodoArriba = nodoArriba
    this.nodoAbajo = nodoAbajo

  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDAContatenacion | FDASimple) {
    this.nodoDerecha = nodoDerecha
  }

  setNodoAbajo (nodoAbajo: Nodo | FDAContatenacion | FDASimple) {
    this.nodoAbajo = nodoAbajo
  }
  setNodoArriba (nodoArriba: Nodo | FDAContatenacion | FDASimple) {
    this.nodoArriba = nodoArriba
  }
}
enum Cerradura {
  Kleen = '+',
  Opcional = '?',
  Positiva = '*'
}
enum Operaciones {
  Contatenacion = 'Contatenacion',
  Union = 'Union',
  CerraduraPositiva = 'CerraduraPositiva',
  CerraduraOpcional = 'CerraduraOpcional',
  CerraduraKleen = 'CerraduraKleen'
}

class Thompson {
  caracteresReservados: string[] = ['*', '?', '(', ')', '|']
  cerraduraPositiva: string = '+'
  cerraduraOpcional: string = '?'
  union: string = '|'
  cerraduraKleen: string = '*'
  parentecisIzquierdo: string = ')'
  parentecisDerecho: string = '('
  alfabeto = ['a', 'b', 'c', 'd']
  fda: FDASimple | FDAContatenacion
  nodos:number =0
  constructor (entrada: string[]) {
    this.limpiarEntrada(entrada)
    this.fda = this.procesarEntrada(entrada)
    this.procesarAFD(this.fda)
    console.log(this.fda)
  }

  limpiarEntrada (entrada: string[]) {
    entrada.map((caracter: string) => {
      const esUnCaracterInvalido =
        !this.alfabeto.includes(caracter) &&
        !this.caracteresReservados.includes(caracter)
      if (esUnCaracterInvalido) {
        throw new Error('Su cadena incluye caracteres válidos')
      }
    })
  }
  procesarAFD (afnd:FDAContatenacion|FDAUnion|FDASimple|Nodo) {
    if (afnd instanceof FDAContatenacion) {
      this.procesarAFD(afnd.nodoIzquierda)
      this.procesarAFD(afnd.nodoDerecha)
    }
    if (afnd instanceof FDAUnion) {
      this.procesarAFD(afnd.nodoArriba)
      console.log("|")
      this.procesarAFD(afnd.nodoAbajo)
    }
    if (afnd instanceof FDASimple) {
      console.log(afnd.caracter)
    }
  }


  buscarCerradura = (
    entrada: string[]
  ): { existe: boolean; caracter: string; index: number; tipo: Cerradura } => {
    let cerradura: {
      existe: boolean
      caracter: string
      index: number
      tipo: Cerradura
    } = {
      existe: false,
      index: -1,
      caracter: null,
      tipo: null
    }
    entrada.find((caracter: string, index: number) => {
      if (caracter === Cerradura.Kleen) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Kleen
        }
        return caracter
      }
      if (caracter === Cerradura.Opcional) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Opcional
        }
        return caracter
      }
      if (caracter === Cerradura.Positiva) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Positiva
        }
        return caracter
      }
    })
    return cerradura
  }
  buscarUnion = (entrada: string[]): { existe: boolean; index: number } => {
    let union: {
      existe: boolean
      index: number
    } = {
      existe: false,
      index: -1
    }
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.union) {
        union = {
          existe: true,
          index
        }
        return caracter
      }
    })
    return union
  }
  procesarEntrada = (
    entrada: string[],
    numeroNodo: number = 0
  ): FDASimple | FDAContatenacion|FDAUnion => {
    console.log(numeroNodo)
    /*     const nodoIzquierdo:FDA
    const nodoDerecho:FDA */
    let operacion: Operaciones = Operaciones.Contatenacion
    let mitadIzquierda: string[]
    let mitadDerecha: string[]
    let fdaIzquierdo: FDASimple | FDAContatenacion
    let fdaDerecho: FDASimple | FDAContatenacion
    let nuevoFDA: FDASimple | FDAContatenacion = null
    if (entrada.length === 1) {
      console.log("ES SIMPLE",{entrada})
      return new FDASimple(entrada[0])
    } else if (this.buscarUnion(entrada).existe) {
      console.log("ES UNION")
      operacion = Operaciones.Union
      const mitad: number = this.buscarUnion(entrada).index
      mitadIzquierda = entrada.slice(0, mitad)
      const adelanteDelCaracter = mitad + 1
      const finalCadena = entrada.length //no considera el último
      mitadDerecha = entrada.slice(adelanteDelCaracter, finalCadena)
      console.log({mitadDerecha,mitadIzquierda})
      fdaIzquierdo = this.procesarEntrada(mitadIzquierda, ++this.nodos)
      fdaDerecho = this.procesarEntrada(mitadDerecha, ++this.nodos)
    } else {
      console.log("ES CONCATENACION")
      /*     const cerradura = this.buscarCerradura(entrada)
    if (cerradura.existe) {
      mitadIzquierda = entrada.slice(0,cerradura.index)
      
    }
    console.log({cerradura}) */
      mitadIzquierda = [entrada.shift()]
      mitadDerecha = entrada
      try {
        fdaIzquierdo = this.procesarEntrada(mitadIzquierda, ++this.nodos)
        fdaDerecho = this.procesarEntrada(mitadDerecha, ++this.nodos)
      } catch (error) {
        console.log({ error, numeroNodo })
      }
    }

    switch (operacion) {
      case Operaciones.Contatenacion:
       
        nuevoFDA = new FDAContatenacion(
          `${fdaIzquierdo.caracter}  ${fdaDerecho.caracter}`,
          fdaIzquierdo,
          fdaDerecho
        )
        break
      case Operaciones.Union:
        
        nuevoFDA = new FDAUnion(
          `${fdaIzquierdo.caracter} | ${fdaDerecho.caracter}`,
          fdaIzquierdo,
          fdaDerecho
        )
        break

      default:
        break
    }
    if (!nuevoFDA) {
      throw new Error('No se ha podido crear el FDA')
    }
    return nuevoFDA
  }
}

const main = () => {
  //let stringEntrada = "(a|b)*abb*"
  let stringEntrada = 'aa|b|c'
  /*     const stringEnArray = $inputDatos.value.trim().split('')
   */
  const data: string[] = stringEntrada.trim().split('')

  try {
    const tablaTransiciones = new Thompson(data)
  } catch (error) {
    $errorTitle.innerHTML = error.message
  }

  //Busca parentecis a la izquierda
  /*     const posicionAnterior:number=cerradura.index-1
    if (stringEnArray[posicionAnterior]===")") {
        console.log("hay un parentesis")
    }
    console.log("Cerradura:",{cerradura}) */
}
$botonStart.addEventListener('click', main)
