export type ClientPageType = 'films' | 'ticketsSelect' | 'ticketsBooking'

export interface FilmType {
  id: number
  film_name: string
  film_duration: number
  film_description: string
  film_origin: string
  film_poster: string
}

export type SeatType = 'standart' | 'vip' | 'taken' | 'disabled' 

export interface HallType {
  id: number
  hall_name: string
  hall_open: number
  hall_places: number
  hall_price_standart: number
  hall_price_vip: number
  hall_rows: number
  hall_config: SeatType[][]
}

export interface SeanceType {
  id: number
  seance_hallid: number
  seance_filmid: number
  seance_time: string
}

export interface ResultAllDataType {
  films: FilmType[]
  halls: HallType[]
  seances: SeanceType[]
}

export interface AllDataType {
  succes: boolean
  result: ResultAllDataType
}

export interface DateHallConfig {
  succes: boolean
  result: SeatType[][]
}

export interface SeanceWithHallType extends SeanceType {
  seance_hallname: string | undefined
}