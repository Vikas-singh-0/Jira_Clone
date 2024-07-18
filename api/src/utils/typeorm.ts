// @ts-nocheck
import { Project, User, Issue, Comment } from '../entities';
import { EntityNotFoundError, BadUserInputError } from '../errors';
import { generateError } from '../utils/validation';
import { BaseEntity, FindOneOptions, EntityTarget } from 'typeorm';

type EntityConstructor = typeof Project | typeof User | typeof Issue | typeof Comment;
type EntityInstance = Project | User | Issue | Comment;

const entities: { [key: string]: EntityConstructor } = { Comment, Issue, Project, User };


// Define a generic function to find an entity or throw an error if not found
export const findEntityOrThrow = async <T>(
  entityTarget: EntityTarget<T>, // EntityTarget<T> is a generic type from TypeORM
  id: number | string,
  options?: FindOneOptions,
): Promise<T> => {
  const instance = await BaseEntity.findOne(entityTarget, id, options);
  if (!instance) {
    throw new EntityNotFoundError(entityTarget.name as string); // Use entityTarget.name for error message
  }
  return instance;
};


export const validateAndSaveEntity = async <T extends EntityInstance>(instance: T): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if ('validations' in Constructor) {
    const errorFields = generateError(instance, Constructor.validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return instance.save() as Promise<T>;
};

export const createEntity = async <T extends EntityConstructor>(
  Constructor: T,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = Constructor.create(input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance);
};

export const deleteEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  await instance.remove();
  return instance;
};
