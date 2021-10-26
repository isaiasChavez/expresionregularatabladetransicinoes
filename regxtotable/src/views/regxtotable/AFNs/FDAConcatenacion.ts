import { random } from "../../../utils"
import FDA from "./FDA.interface"
import FDACerraduraKleen from "./FDACerradura"
import FDASimple from "./FDASimple"
import FDAUnion from "./FDAUnion"
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

  static traerUltimoAlaDerecha = (fda: FDAContatenacion): FDASimple | Nodo => {
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
    throw new Error('No he encontrado nodo a la derecha')
  }
  static traerUltimoAlaIzquierda = (fda: FDAContatenacion): FDASimple | Nodo => {
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
    throw new Error('No he encontrado nodo a la izquierda')
  }

}
export default FDAContatenacion