const $botonStart = document.getElementById('bottonEntrada')
const $inputDatos: any = document.getElementById('entradaDeTexto')
const $errorTitle: any = document.getElementById('textError')
const cadenaProcesada: any = document.getElementById('cadenaProcesada')
const $titulosTabla: any = document.getElementById('titulosTabla')
const $tabla: any = document.getElementById('tablaResultado')

let alfabetoInicial = ['a', 'b', 'c', 'd']


export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
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

class Nodo {
  esInicial: boolean
  esFinal: boolean
  caracter: string

  esDesechado: boolean
  fda: FDAContatenacion | FDASimple | FDAUnion | FDACerraduraKleen
  numeroNodo: number = random(0, 1000)
  nodoDerecha:
    | FDASimple
    | FDAContatenacion
    | FDAUnion
    | Nodo
    | FDACerraduraKleen

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
  numeroNodo: number
  caracter: string
  nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen

  setNodoDerecha(
    nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
  setNodoIzquierda(
    nodoIzquierda: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
}

class FDASimple implements FDA {
  caracter: string
  numeroNodo: number = random(0, 1000)

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

  constructor (caracter: string, numeroNodo: number) {
    this.caracter = caracter
    this.numeroNodo = numeroNodo
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
  numeroNodo: number = random(0, 1000)
  constructor (
    caracter: string,
    nodoIzquierda: FDASimple | FDAContatenacion,
    nodoDerecha: FDASimple | FDAContatenacion,
    numeroNodo: number
  ) {
    this.caracter = caracter
    nodoIzquierda.setNodoDerecha(nodoDerecha)
    this.nodoIzquierda = nodoIzquierda
    this.nodoDerecha = nodoDerecha
    this.numeroNodo = numeroNodo
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
  numeroNodo: number = random(0, 1000)

  //Arriba
  nodoAbajo: FDASimple | FDAContatenacion | Nodo | FDACerraduraKleen
  nodoArriba: FDASimple | FDAContatenacion | Nodo | FDACerraduraKleen
  //Abajo

  nodoDerecha: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })

  nodoIzquierda: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  constructor (
    caracter: string,
    nodoArriba: FDASimple | FDAContatenacion,
    nodoAbajo: FDASimple | FDAContatenacion,
    numeroNodo: number
  ) {
    this.caracter = caracter
    this.nodoArriba = nodoArriba
    this.nodoAbajo = nodoAbajo
    this.numeroNodo = numeroNodo
  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDASimple) {
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
  numeroNodo: number = random(0, 1000)

  nodoIzquierda: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  nodoDerecha: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })
  nodo: FDASimple | FDAContatenacion | FDAUnion | Nodo | FDACerraduraKleen

  tipo:Cerradura
  constructor (
    caracter: string,
    nodo: FDASimple | FDAContatenacion | FDAUnion,
    numeroNodo: number,
    tipo:Cerradura
  ) {
    this.nodo = nodo
    this.caracter = caracter
    this.numeroNodo = numeroNodo
    this.tipo = tipo
  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDASimple) {
    this.nodoDerecha = nodoDerecha
  }
}


class TituloTabla {
  titulo: string
  constructor (nombre: string) {
    this.titulo = nombre
  }
  getTag () {
    return `
    <th class="border-2">${this.titulo}</th>
    `
  }
}
class ColumnaTabla {
  tag: string
  constructor () {
    this.tag = `<td class="border-2"></td>`
  }
  getTag (): string {
    return this.tag
  }
  setapuntaA (caracter: string | number) {
    this.tag = `<td class="border-2"> ${caracter} </td>`
    return this
  }
}

class FilaTabla {
  columnas = {}
  tag: string = ``
  constructor (edo: string | number) {
    const columnaEdo = new ColumnaTabla()
    columnaEdo.setapuntaA(edo)

    this.columnas['EDO'] = columnaEdo

    alfabetoInicial.map(caracter => {
      this.columnas[caracter] = new ColumnaTabla()
    })
    this.columnas[`ε`] = new ColumnaTabla()
  }
  setValue (datos: { caracter: string; apuntaA: string | number }) {
    if (this.columnas.hasOwnProperty(datos.caracter)) {
      const nuevaColumna = new ColumnaTabla()
      nuevaColumna.setapuntaA(datos.apuntaA)
      this.columnas[datos.caracter] = nuevaColumna
    } else {
      throw new Error('No existe el caracter en el alfabeto')
    }
  }
  getTag (): string {
    this.tag += `<tr class="fila">`
    for (const key in this.columnas) {
      const columna: ColumnaTabla = this.columnas[key]
      this.tag += columna.getTag()
    }
    this.tag += `</tr>`
    return this.tag
  }
}

class Thompson {

  caracteresReservados: string[] = ['*', '?', '(', ')', '|','+','?']
  cerraduraPositiva: string = '+'
  cerraduraOpcional: string = '?'
  union: string = '|'
  epsilon: string = 'ε'
  cerraduraKleen: string = '*'
  parentecisIzquierdo: string = '('
  parentecisDerecho: string = ')'

  alfabeto: string[] = alfabetoInicial

  fda: FDASimple | FDAContatenacion

  fdaProcesado: string = ''

  nodos: number = 0

  constructor (entrada: string[]) {
    this.limpiarEntrada(entrada)
    this.fda = this.procesarEntrada(entrada, null)
    console.log(this.fda)
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
    $titulosTabla.innerHTML += new TituloTabla('EDO').getTag()
    this.alfabeto.map(caracter => {
      $titulosTabla.innerHTML += new TituloTabla(caracter).getTag()
    })
    $titulosTabla.innerHTML += new TituloTabla('ε').getTag()
  }

  traerUltimoAlaDerecha = (fda: FDAContatenacion): FDASimple | Nodo => {
    if (fda.nodoDerecha instanceof FDASimple) {
      return fda.nodoDerecha
    }
    if (fda.nodoDerecha instanceof FDAContatenacion) {
      return this.traerUltimoAlaDerecha(fda.nodoDerecha)
    }
    if (
      fda.nodoDerecha instanceof FDACerraduraKleen ||
      fda.nodoDerecha instanceof FDAUnion
    ) {
      return fda.nodoDerecha.nodoDerecha
    }
  }

  traerUltimoAlaIzquierda = (fda: FDAContatenacion): FDASimple | Nodo => {
    if (fda.nodoIzquierda instanceof FDASimple) {
      return fda.nodoIzquierda
    }
    if (fda.nodoIzquierda instanceof FDAContatenacion) {
      return this.traerUltimoAlaIzquierda(fda.nodoIzquierda)
    }
    if (
      fda.nodoIzquierda instanceof FDACerraduraKleen ||
      fda.nodoIzquierda instanceof FDAUnion
    ) {
      //A la izquierda del concatendado y a la izquierda de ese mismo
      return fda.nodoIzquierda.nodoIzquierda
    }
  }

  generarFilasTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    ///GENERAR FILAS CONCATENACION
    if (afnd instanceof FDAContatenacion) {
      this.generarFilasTablaFDA(afnd.nodoIzquierda)
      this.generarFilasTablaFDA(afnd.nodoDerecha)
    }
    ///GENERAR FILAS UNION

    if (afnd instanceof FDAUnion) {
      let filaArribaDerecha: FilaTabla
      let filaAbajoDerecha: FilaTabla
      let filaArribaIzquierda: FilaTabla
      let filaAbajoIzquierda: FilaTabla

      if (afnd.nodoArriba instanceof FDAContatenacion) {

        const ultimoArribaDerecha = this.traerUltimoAlaDerecha(afnd.nodoArriba)
        filaArribaDerecha = new FilaTabla(
          ultimoArribaDerecha.nodoDerecha.numeroNodo + ' IN'
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoArribaIzquierda = this.traerUltimoAlaIzquierda(
          afnd.nodoArriba
        )
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN'
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoArribaIzquierda.numeroNodo
        })
      }
      if (afnd.nodoArriba instanceof FDASimple) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' IN'
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN'
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.numeroNodo
        })
      }

      if (afnd.nodoArriba instanceof FDAUnion) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' IN'
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN'
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.nodoIzquierda.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAContatenacion) {
        const ultimoAbajoDerecha = this.traerUltimoAlaDerecha(afnd.nodoAbajo)
        filaAbajoDerecha = new FilaTabla(
          ultimoAbajoDerecha.nodoDerecha.numeroNodo + ' CON'
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoAbajoIzquierda = this.traerUltimoAlaIzquierda(
          afnd.nodoAbajo
        )
        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' CON'
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoAbajoIzquierda.numeroNodo
        })
      }
      if (afnd.nodoAbajo instanceof FDASimple) {
        console.log('es simple')
        filaAbajoDerecha = new FilaTabla(
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' SIMPLE'
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' SIMPLE'
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAUnion) {
        console.log('es  UNION')

        filaAbajoDerecha = new FilaTabla(
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' UNION'
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' UNION'
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.nodoIzquierda.numeroNodo
        })
      }

      $tabla.innerHTML += filaArribaDerecha.getTag()
      $tabla.innerHTML += filaAbajoDerecha.getTag()

      $tabla.innerHTML += filaArribaIzquierda.getTag()
      $tabla.innerHTML += filaAbajoIzquierda.getTag()

      this.generarFilasTablaFDA(afnd.nodoArriba)
      this.generarFilasTablaFDA(afnd.nodoAbajo)
    }
    ///GENERAR FILAS KLEEN
    if (afnd instanceof FDACerraduraKleen) {

      let filaDerecha: FilaTabla
      let filaIzquierda: FilaTabla
      let filaCentro: FilaTabla
      let filaGrande: FilaTabla

      filaGrande = new FilaTabla(afnd.nodoIzquierda.numeroNodo + ' KLENN 1')

      if (afnd.nodoDerecha instanceof FDASimple) {
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
      }

      if (afnd.nodoDerecha instanceof FDAContatenacion) {
        const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })
      }
      if (
        afnd.nodoDerecha instanceof FDAUnion ||
        afnd.nodoDerecha instanceof FDACerraduraKleen
      ) {
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
        })
      }


      if (afnd.nodo instanceof FDASimple) {
        console.log("No debo estar aquí")
        filaIzquierda = new FilaTabla(afnd.nodoIzquierda.numeroNodo + ' KLENN 2')
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })

        filaDerecha = new FilaTabla(afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 3')
        
        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }



        filaCentro = new FilaTabla(afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 4')
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAContatenacion) {
        console.log("No debo estar aquí")
        const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodo)
        filaIzquierda = new FilaTabla(afnd.nodoIzquierda.numeroNodo + ' KLENN 5')
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })

        const ultimoDerecha = this.traerUltimoAlaDerecha(afnd.nodo)

        filaDerecha = new FilaTabla(ultimoDerecha.numeroNodo + ' KLENN 6')

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }

        filaCentro = new FilaTabla(ultimoDerecha.numeroNodo + ' KLENN 7')
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAUnion) {
console.log("SI debo estar aquí",{filaCentro})
        filaIzquierda = new FilaTabla(afnd.nodoIzquierda.numeroNodo + ' KLENN 8')
        filaIzquierda.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
          })


        filaDerecha = new FilaTabla(afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 9')
      
         if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }


        filaCentro = new FilaTabla(afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 10')
        console.log({filaCentro})
        if (afnd.nodo instanceof FDAContatenacion) {
          console.log("cambio1")
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodo)
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodo instanceof FDAUnion
        ) {
          console.log("cambio2")
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodo instanceof FDACerraduraKleen
        ) {
          console.log("cambio3")
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodo instanceof FDASimple
        ) {
          console.log("cambio4")
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.numeroNodo
          })
        }
      }
      //
      console.log("=>",{filaCentro})

      if (afnd.tipo ===Cerradura.Kleen) {
        $tabla.innerHTML += filaCentro.getTag()
        $tabla.innerHTML += filaIzquierda.getTag()
        $tabla.innerHTML += filaDerecha.getTag()
        $tabla.innerHTML += filaGrande.getTag()
      }
      if (afnd.tipo ===Cerradura.Opcional) {
        $tabla.innerHTML += filaIzquierda.getTag()
        $tabla.innerHTML += filaDerecha.getTag()
        $tabla.innerHTML += filaGrande.getTag()
      }
      if (afnd.tipo ===Cerradura.Positiva) {
        $tabla.innerHTML += filaCentro.getTag() 
        $tabla.innerHTML += filaIzquierda.getTag()
        $tabla.innerHTML += filaDerecha.getTag()
      }

      this.generarFilasTablaFDA(afnd.nodo)
    }
    ///GENERAR FILAS SIMPLE

    if (afnd instanceof FDASimple) {
      //Solo son dos nodos
      const fila = new FilaTabla(afnd.numeroNodo)

      if (afnd.nodoDerecha instanceof FDAContatenacion) {
        fila.setValue({
          caracter: afnd.caracter,
          apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
        })
      } else {
        fila.setValue({
          caracter: afnd.caracter,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
      }

      $tabla.innerHTML += fila.getTag()
    }
  }
  generarTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    console.log('Generar tabla', { afnd })
    this.generarTitulosTablaFDA()
    this.generarFilasTablaFDA(afnd)
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
      return new FDASimple(entrada[0], numeroNodo)
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
        cerraduraProcesada,
        numeroNodo,
        cerradura.tipo
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
          fdaDerecho,
          numeroNodo
        )
        break
      case Operaciones.Union:
        nuevoFDA = new FDAUnion(
          `${fdaIzquierdo.caracter} | ${fdaDerecho.caracter}`,
          fdaIzquierdo,
          fdaDerecho,
          numeroNodo
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
  $errorTitle.innerHTML = ''

  let data: string[] = $inputDatos.value.trim().split('')

  const filas = document.querySelectorAll(".fila")
  console.log({filas})
  for (let index = 0; index < filas.length; index++) {
    const fila = filas[index];
    console.log({fila})
    fila.parentNode.removeChild(fila)
  }
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
