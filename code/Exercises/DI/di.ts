type Constructor<T> = new (...args: any[]) => T;
export class Injector {
  private static dpependencies = new Map<string, Constructor<unknown>>();
  private static dependenciesInstance = new Map<string, unknown>();

  static get<T>(dependencyName: string): T {
    // get dependency instance from injector state
    const dependencyInstance = this.dependenciesInstance.get(dependencyName);
    if (dependencyInstance) {
      return dependencyInstance as T;
    }
    // if not exist get its contructor create it and save into injector state
    const dependencyCtor = this.dpependencies.get(dependencyName);
    if (!dependencyCtor) {
      throw new Error(
        `dependency ${dependencyName} is missing, did you add it to injector ???`
      );
    }

    const dependencies: unknown[] =
      Reflect.getOwnMetadata("__dependencies__", dependencyCtor) ?? [];
    let instance;
    if (dependencyCtor) {
      instance = new dependencyCtor(...dependencies);
    }

    // get dependencies from metadata and instantiate the dependency with its dependencies
    this.dependenciesInstance.set(dependencyName, instance);

    return instance as T;
  }

  static set(dependencyName: string, dependency: Constructor<unknown>) {
    // set dependency constructor into the injector state
    this.dpependencies.set(dependencyName, dependency)
  }
}

export function Inject(dependencyName: string) {
  return function (constructor: new () => unknown, _: any, paramOrder: number) {
    // property decorator, this one should understand what dependency the user expect to inject into the constructor property
    const dependencyInstance = Injector.get(dependencyName);
    console.log(dependencyInstance);
    const dependencies: unknown[] = Reflect.getOwnMetadata('__dependencies__', constructor) ?? [];
    console.log(dependencies);
    // it should get the dependency from injector and add to it the metadata to be ready to be taken (line 11)
    dependencies.push(dependencyInstance)
    console.log(dependencies);
    Reflect.defineMetadata('__dependencies__', dependencies, constructor);
  };
}

export function Injectable(dependencyName: string) {
  return (constructor: Constructor<unknown>) => {
    // class decorator
    // add dependency constructor into the injector state
    Injector.set(dependencyName, constructor)
  };
}
