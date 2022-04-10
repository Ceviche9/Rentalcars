import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/entities/Rental";
import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = []

  async create({ car_id, user_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental()

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      start_date: new Date(),
    })

    this.rentals.push(rental)

    return rental
  }

  async findById(rental_id: string): Promise<Rental> {
    return this.rentals.find(rental => rental.id === rental_id)
  }

  async findByUsersId(user_id: string): Promise<Rental[]> {
    return this.rentals.filter(rental => rental.user_id === user_id)
  }

  async findOpenRentalByCarsId(car_id: string): Promise<Rental> {
    return this.rentals.find(rental => rental.car_id === car_id && !rental.end_date)
  }

  async findOpenRentalByUsersId(user_id: string): Promise<Rental> {
    return this.rentals.find(rental => rental.user_id === user_id && !rental.end_date)
  }

}

export { RentalsRepositoryInMemory }