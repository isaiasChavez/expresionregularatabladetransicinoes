import { random } from "../../../utils"
import { Cerradura } from "../types"
import FDA from "./FDA.interface"
import FDAContatenacion from "./FDAConcatenacion"
import FDASimple from "./FDASimple"
import FDAUnion from "./FDAUnion"
import Nodo from "./Nodo"

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

export default FDACerraduraKleen