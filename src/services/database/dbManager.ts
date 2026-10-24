import * as SQLite from "expo-sqlite";
import { PlannerTask, TaskCategory, Place, CreatePlannerTaskDTO } from "../";
import { FontAwesomeIconName } from "@react-native-vector-icons/fontawesome";
import { colors } from "../../themes";

export class DbManager {
  private static instance: DbManager | null = null;
  private db: SQLite.SQLiteDatabase | null = null;

  private taskList: PlannerTask[] = [];
  private categoryList: TaskCategory[] = [];
  private dateList: string[] = [];
  private placeList: Place[] = [];

  //Estrutura singleton: construtor privado e instancia única
  private constructor() {}

  public static async initDB(): Promise<DbManager> {
    if (!DbManager.instance) {
      const instance = new DbManager();
      await instance.setupDatabase();
      DbManager.instance = instance;
    }
    return DbManager.instance;
  }

  //Cria as tabelas
  private async setupDatabase() {
    this.db = await SQLite.openDatabaseAsync("planner.db");

    await this.db.execAsync(`PRAGMA foreign_keys = ON;`);

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS task_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT UNIQUE NOT NULL,
        category_color TEXT,
        category_icon TEXT
      );

      CREATE TABLE IF NOT EXISTS task_places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place_name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT,
        hour TEXT,
        category TEXT,
        description TEXT,
        place TEXT,
        completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0 , 1)),
        FOREIGN KEY (category) REFERENCES task_categories (category_name) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (place) REFERENCES task_places (place_name) ON DELETE SET NULL

      );            
      `);

    await this.refreshLists();
  }

  //Atualiza as listas de dados
  public async refreshLists() {
    if (!this.db) return;

    const allTasks = await this.db.getAllAsync<
      Omit<PlannerTask, "completed"> & { completed: number }
    >(`SELECT * FROM tasks`);

    this.taskList = allTasks.map((task) => ({
      ...task,
      completed: task.completed === 1,
    }));

    this.categoryList = await this.db.getAllAsync<TaskCategory>(
      `SELECT * FROM task_categories`,
    );

    this.placeList = await this.db.getAllAsync<Place>(
      `SELECT * FROM task_places`,
    );

    const dates = await this.db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT date FROM tasks WHERE date IS NOT NULL;`,
    );

    this.dateList = dates.map((d) => d.date);
  }

  //-----Setters----//

  //Guarda uma nova task no DB, e retorna se houver sucesso
  public async insertNewTask(task: CreatePlannerTaskDTO) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    const result = await this.db.runAsync(
      `INSERT INTO tasks (name, date, hour, category, description, place, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        task.name,
        task.date,
        task.hour,
        task.category ?? null,
        task.description ?? null,
        task.place ?? null,
        task.completed ? 1 : 0,
      ],
    );
    await this.refreshLists();

    console.log("Tarefa inserida com id: " + result.lastInsertRowId);
  }

  //Adiciona uma categoria à uma Task e à tabela de categorias, se não existir nela
  public async insertNewCategory(
    newCategory: string,
    categoryColor?: string,
    categoryIcon?: FontAwesomeIconName,
  ) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    const color = categoryColor ?? colors.Foreground;

    await this.db.runAsync(
      `
      INSERT OR IGNORE INTO task_categories (category_name, category_color, category_icon) VALUES (?, ?, ?);
      `,
      newCategory,
      color,
      categoryIcon ?? null,
    );

    await this.refreshLists();
  }

  public async setCategoryColor(categoryId: number, newColor: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE task_categories SET category_color = ? WHERE id = ?;
      `,
      newColor,
      categoryId,
    );
    await this.refreshLists();
  }

  public async setCategoryIcon(
    categoryId: number,
    newIcon: FontAwesomeIconName,
  ) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE task_categories SET category_icon = ? WHERE id = ?;
      
      `,
      newIcon,
      categoryId,
    );
    await this.refreshLists();
  }

  public async setCategoryName(categoryId: number, newName: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE task_categories SET category_name = ? WHERE id = ?;`,
      newName,
      categoryId,
    );

    await this.refreshLists();
  }

  //Adiciona ou atualiza a descrição de uma Task
  public async setTaskCategory(taskId: number, newCategory: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
        UPDATE tasks SET category = ? WHERE id = ?;
        `,
      newCategory,
      taskId,
    );
    await this.refreshLists();
  }

  public async setTaskDescription(taskId: number, description: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
        UPDATE tasks SET description = ? WHERE id = ?;
        `,
      description,
      taskId,
    );
    await this.refreshLists();
  }

  //Associa um local a uma Task
  public async setTaskPlace(taskId: number, place: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      INSERT OR IGNORE INTO task_places (place_name) VALUES (?);
      `,
      place,
    );

    await this.db.runAsync(
      `
        UPDATE tasks SET place = ? WHERE id = ?;
        `,
      place,
      taskId,
    );
    await this.refreshLists();
  }

  public async setTaskName(taskId: number, newName: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE tasks SET name = ? WHERE id = ?;      
      `,
      newName,
      taskId,
    );
    await this.refreshLists();
  }

  public async setTaskDate(taskId: number, newDate: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE tasks SET date = ? WHERE id = ?;`,
      newDate,
      taskId,
    );
    await this.refreshLists();
  }

  public async setTaskHour(taskId: number, newHour: string) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE tasks SET hour = ? WHERE id = ?;`,
      newHour,
      taskId,
    );
    await this.refreshLists();
  }

  public async setTaskCompleted(taskId: number, completed: boolean) {
    if (!this.db) throw new Error("Base de dados não inicializada.");

    await this.db.runAsync(
      `
      UPDATE tasks SET completed = ? WHERE id = ?;`,
      completed ? 1 : 0,
      taskId,
    );
    await this.refreshLists();
  }

  //-----Getters-----//

  public getAllTasks(): PlannerTask[] {
    return [...this.taskList];
  }

  public getTask(id: number): PlannerTask | undefined {
    return this.taskList.find((task) => task.id === id);
  }

  public getAllCategories(): TaskCategory[] {
    return [...this.categoryList];
  }

  public getAllDates(): string[] {
    return [...this.dateList];
  }

  public getAllPlaces(): Place[] {
    return [...this.placeList];
  }
}
