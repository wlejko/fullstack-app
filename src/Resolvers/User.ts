import { User } from "../Entities";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Password have to contain at least 3 characters",
          },
        ],
      };
    }

    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username have to contain at least 3 characters",
          },
        ],
      };
    }

    const hashPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      userName: options.username,
      password: hashPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "Username has already be taken",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOneOrFail(User, { userName: options.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "That username doesnt exist" }],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "This is incorrect password" }],
      };
    }

    req.session!.userId = user.id;

    return { user };
  }
}
