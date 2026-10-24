import { TaskCategory, PlannerTask } from "./";

export class DataHandler {
  private constructor() {}
  //Retorna a data atual no formato "AAAA-MM-DD"
  static formatedToday = () => {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  };
  //Encontra recebe a lista de categorias e devolve uma categoria específica com base no nome
  static categoryHandler = (
    categories: TaskCategory[],
    categoryName: string,
  ): TaskCategory | undefined =>
    categories.find((category) => category.category_name === categoryName);

  //Retorna os horários disponíveis para marcar uma atividade
  static availableHours = (selectedDate: string) => {
    let selectableHours: string[] = [];

    const currentDate = this.formatedToday();

    if (selectedDate < currentDate) {
      return selectableHours;
    }

    let startMinutes = 0;

    if (selectedDate === currentDate) {
      const now = new Date();

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      startMinutes = (Math.floor(currentMinutes / 30) + 1) * 30;
    }

    for (let m = startMinutes; m < 24 * 60; m += 30) {
      const hour = Math.floor(m / 60);
      const minutes = Math.floor(m % 60);

      selectableHours.push(
        String(hour).padStart(2, "0") + ":" + String(minutes).padStart(2, "0"),
      );
    }
    return selectableHours;
  };

  //Retorna uma lista de tarefas filtradas pela categoria
  static filterTaksByCategory(taskList: PlannerTask[], categoryName: string) {
    if (categoryName === "Todas") return taskList;

    return taskList.filter((task) => task.category === categoryName);
  }
}
