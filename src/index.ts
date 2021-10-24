const $botonStart = document.getElementById('bottonEntrada')
const $inputDatos: any = document.getElementById('entradaDeTexto')
const $errorTitle: any = document.getElementById('textError')
const cadenaProcesada: any = document.getElementById('cadenaProcesada')
const $titulosTabla: any = document.getElementById('titulosTabla')

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Nodo {
  esInicial: boolean
  esFinal: boolean
  esDesechado: boolean
  fda: FDAContatenacion | FDASimple | FDAUnion | FDACerraduraKleen
  numeroNodo: number = random(0, 1000)

  constructor (datos: {
    esInicial: boolean
    esFinal: boolean
    esDesechado: boolean
    fda: FDAContatenacion | FDASimple | FDAUnion | FDACerraduraKleen
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
  setNodoDerecha(
    nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
  setNodoIzquierda(
    nodoIzquierda: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
}

class FDASimple implements FDA {
  caracter: string

  nodoDerecha:
    | Nodo
    | FDAContatenacion
    | FDASimple
    | FDACerraduraKleen = new Nodo({
    esInicial: false,
    esFinal: true,
    esDesechado: false,
    fda: this
  })

  constructor (caracter: string) {
    this.caracter = caracter
  }
  setNodoDerecha (
    nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any {
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

class FDACerraduraKleen implements FDA {
  caracter: string

  nodoIzquierda:
    | FDASimple
    | FDAContatenacion
    | FDAUnion
    | Nodo
    | FDACerraduraKleen = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  nodoDerecha:
    | FDASimple
    | FDAContatenacion
    | FDAUnion
    | Nodo
    | FDACerraduraKleen = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })
  nodo: FDASimple | FDAContatenacion | FDAUnion | Nodo | FDACerraduraKleen

  constructor (
    caracter: string,
    nodo: FDASimple | FDAContatenacion | FDAUnion
  ) {
    this.nodo = nodo
    this.caracter = caracter
  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDAContatenacion | FDASimple) {
    this.nodoDerecha = nodoDerecha
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

const tituloTabla = (nombre:string)=>{
  return `
  <th>${nombre}</th>
  `
}

class Thompson {
  caracteresReservados: string[] = ['*', '?', '(', ')', '|']
  cerraduraPositiva: string = '+'
  cerraduraOpcional: string = '?'
  union: string = '|'
  cerraduraKleen: string = '*'
  parentecisIzquierdo: string = '('
  parentecisDerecho: string = ')'
  alfabeto = ['a', 'b', 'c', 'd']
  fda: FDASimple | FDAContatenacion
  fdaProcesado: string = ''
  nodos: number = 0

  constructor (entrada: string[]) {
    this.limpiarEntrada(entrada)
    this.fda = this.procesarEntrada(entrada, null)
    this.generarStringFDA(this.fda)
    this.generarTablaFDA(this.fda)
  }
  generarStringFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    if (afnd instanceof FDAContatenacion) {
      this.generarStringFDA(afnd.nodoIzquierda)
      this.generarStringFDA(afnd.nodoDerecha)
    }
    if (afnd instanceof FDAUnion) {
      this.generarStringFDA(afnd.nodoArriba)
      this.fdaProcesado += '|'
      this.generarStringFDA(afnd.nodoAbajo)
    }
    if (afnd instanceof FDACerraduraKleen) {
      this.fdaProcesado += '('
      this.generarStringFDA(afnd.nodo)
      this.fdaProcesado += ')*'
    }
    if (afnd instanceof FDASimple) {
      this.fdaProcesado += afnd.caracter
    }
  }
  generarTitulosTablaFDA () {
    this.alfabeto.map(caracter=>{
      $titulosTabla.innerHTML += tituloTabla(caracter)
    })
    $titulosTabla.innerHTML += tituloTabla('ε')
  }
   generarTablaFDA (afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen) {
      this.generarTitulosTablaFDA()
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

  encontrarParentesisIzquierdo = (entrada: string[]): number => {
    let indexC = -1
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.parentecisIzquierdo) {
        indexC = index
        return caracter
      }
    })
    if (indexC === -1) {
      throw new Error('Las clausuras requieren un parentesis de cierre')
    }
    return indexC
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
  limpiarCerradura = (entrada: string[]): string[] => {
    let seccionCerradura: string[]
    entrada.pop()
    const indexDerecho = entrada.length - 1
    const final = entrada[indexDerecho]
    const existenParentesis = final === this.parentecisDerecho
    if (existenParentesis) {
      const indexIzquierdo = this.encontrarParentesisIzquierdo(entrada)
      seccionCerradura = entrada.slice(indexIzquierdo + 1, indexDerecho)
    } else {
      throw new Error('Las clausuras requieren parentesis')
    }
    return seccionCerradura
  }
  procesarEntrada = (
    entrada: string[],
    nodoDerecho: FDACerraduraKleen | FDASimple | FDAContatenacion | FDAUnion,
    numeroNodo: number = ++this.nodos
  ): FDASimple | FDAContatenacion | FDAUnion => {
    console.log(numeroNodo)
    /*     const nodoIzquierdo:FDA
    const nodoDerecho:FDA */
    let operacion: Operaciones = Operaciones.Contatenacion
    let mitadIzquierda: string[]
    let mitadDerecha: string[]
    let fdaIzquierdo: FDASimple | FDAContatenacion
    let fdaDerecho: FDASimple | FDAContatenacion
    let nuevoFDA: FDASimple | FDAContatenacion = null
    const finalCadena = entrada.length
    let cerraduraLimpia: string[]

    if (entrada.length === 1) {
      console.log('ES SIMPLE', { entrada })
      return new FDASimple(entrada[0])
    } else if (this.buscarCerradura(entrada).existe) {
      console.log('ES CERRADURA')
      const cerradura = this.buscarCerradura(entrada)

      const adelanteDeCerradura = cerradura.index + 1
      mitadIzquierda = entrada.slice(0, adelanteDeCerradura)

      cerraduraLimpia = this.limpiarCerradura([...mitadIzquierda])

      const indexParetensisIzquierdo = this.encontrarParentesisIzquierdo(
        entrada
      )

      if (!nodoDerecho) {
        mitadDerecha = entrada.slice(adelanteDeCerradura, finalCadena)

        if (mitadDerecha[0] === this.union) {
          operacion = Operaciones.Union
          mitadDerecha.shift()
        }

        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = nodoDerecho
      }

      const cerraduraProcesada:
        | FDAContatenacion
        | FDASimple
        | FDAUnion = this.procesarEntrada(cerraduraLimpia, null)

      const nuevaCerradura: FDACerraduraKleen = new FDACerraduraKleen(
        `(${cerraduraProcesada.caracter})*`,
        cerraduraProcesada
      )
      const cerraduraEstaAlInicio = indexParetensisIzquierdo === 0
      if (!cerraduraEstaAlInicio) {
        const mitadMitadIzquierdaConCerradura = entrada.slice(
          0,
          indexParetensisIzquierdo
        )
        fdaIzquierdo = this.procesarEntrada(
          mitadMitadIzquierdaConCerradura,
          nuevaCerradura
        )
      } else {
        fdaIzquierdo = nuevaCerradura
      }
    } else if (this.buscarUnion(entrada).existe) {
      operacion = Operaciones.Union
      const mitad: number = this.buscarUnion(entrada).index
      mitadIzquierda = entrada.slice(0, mitad)
      fdaIzquierdo = this.procesarEntrada(mitadIzquierda, null)

      if (!nodoDerecho) {
        const adelanteDelCaracter = mitad + 1
        mitadDerecha = entrada.slice(adelanteDelCaracter, finalCadena)
        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = nodoDerecho
      }
    } else {
      mitadIzquierda = [entrada.shift()]
      mitadDerecha = entrada

      fdaIzquierdo = this.procesarEntrada(mitadIzquierda, null)
      if (!nodoDerecho) {
        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = this.procesarEntrada(mitadDerecha, nodoDerecho)
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
  //let stringEntrada = 'aa|(a|b)*c'
  $errorTitle.innerHTML = ''

  const data: string[] = $inputDatos.value.trim().split('')
  try {
    if (data.length === 0) {
      throw new Error('Debes incluir algun valor')
    }
    const tablaTransiciones = new Thompson(data)
    cadenaProcesada.innerHTML = tablaTransiciones.fdaProcesado
  } catch (error) {
    console.log({ error })
    $errorTitle.innerHTML = error.message
  }
}
$botonStart.addEventListener('click', main)
