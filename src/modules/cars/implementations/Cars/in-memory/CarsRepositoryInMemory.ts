import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = []

  async create({ 
    name,
    description,
    brand,
    category_id,
    daily_rate,
    fine_amount,
    license_plate,
    id
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car()

    Object.assign(car, {
      name,
      description,
      brand,
      category_id,
      daily_rate,
      fine_amount,
      license_plate,
      id
    })

    this.cars.push(car)

    return car
  }

  async findByLicensPlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate)
  }
  
  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const list = this.cars.filter(car => car.available === true)

    if(brand || category_id || name) {
      const filteredCars = list.filter(car => 
        (brand && car.brand === brand) ||
        (category_id && car.category_id === category_id) || 
        (name && car.name === name)
      )

      return filteredCars
    }

    return list
  }

  async findById(car_id: string): Promise<Car> {
    return this.cars.find(car => car.id === car_id)
  }

  async updateAvailable(car_id: string, available: boolean): Promise<void> {
    const carIndex = this.cars.findIndex(car => car.id === car_id)
    this.cars[carIndex].available = available
  }
}

export { CarsRepositoryInMemory }