import 'reflect-metadata'
import "dotenv/config"
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors"
import swaggerUi from "swagger-ui-express"
import swaggerFile from "../../../swagger.json"

import createConnection from "@shared/infra/typeorm"

import "@shared/container"

import { router } from "@shared/infra/http/routes";
import { AppError } from "@shared/infra/http/errors/AppError";
import upload from '@config/upload';

createConnection();
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`))
app.use("/cars", express.static(`${upload.tmpFolder}/cars`))

app.use(express.json())

app.use(router)

// Criando um middleware para os erros
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message})
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`
  })
})

export { app }