import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const weatherResponseSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    }),
  ),
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
  }),
  rain: z
    .object({
      "1h": z.number().optional(),
    })
    .optional(),
  clouds: z.object({
    all: z.number(),
  }),
  name: z.string(),
  id: z.number(),
  timezone: z.number(),
  sys: z.object({
    country: z.string(),
  }),
});

export const weatherRouter = createTRPCRouter({
  getWeather: publicProcedure
    .input(
      z.object({
        city: z.string().min(1, "City name is required"),
        countryCode: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenWeather API key not configured",
        });
      }

      try {
        const query = input.countryCode
          ? `${input.city},${input.countryCode}`
          : input.city;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            query,
          )}&units=metric&appid=${apiKey}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: input.countryCode
                ? `City "${input.city}" not found in country ${input.countryCode}. Please check the spelling and try again.`
                : `City "${input.city}" not found. Please check the spelling or try adding a country code (e.g., "London,UK").`,
            });
          }
          if (response.status === 401) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid API key configuration",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch weather data. Please try again later.",
          });
        }

        const data = (await response.json()) as z.infer<
          typeof weatherResponseSchema
        >;
        return weatherResponseSchema.parse(data);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        if (error instanceof z.ZodError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid weather data received from API",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
