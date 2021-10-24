export class FDA {
  valorFlecha: string
  expresionLlegada: number
  expresionSalida: number
  apuntadorSiguiente: FDA

  constructor (entradaAlfabeto: string, llegada: number) {
    this.valorFlecha = entradaAlfabeto
    if (llegada) {
      this.expresionLlegada = llegada
      this.expresionSalida = llegada + 1
    }
  }

  setNuevoValorFlecha (nuevoValor) {
    this.valorFlecha = nuevoValor
  }
  getValorFlecha (): string {
    return this.valorFlecha
  }

  setLlegada (llegada: number) {
    this.expresionLlegada = llegada
    this.expresionSalida = llegada + 1
  }
  getLlegada () {
    return this.expresionLlegada
  }
  setSalida (salida) {
    this.expresionSalida = salida
    this.expresionSalida = salida + 1
  }
  getSalida () {
    return this.expresionSalida
  }

  setSiguienteFDA (FDA: FDA) {
    this.apuntadorSiguiente = FDA
  }

  getSiguienteFDA () {
    return this.apuntadorSiguiente
  }
}