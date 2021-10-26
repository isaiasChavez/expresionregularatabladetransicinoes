import { random } from "../../../utils"
import FDA from "./FDA.interface"
import FDASimple from "./FDASimple"
import Nodo from "./Nodo"

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
export default FDAContatenacion