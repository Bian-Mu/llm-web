export function answerStandard(answer: string): string {
    if (answer.startsWith("#") || answer.startsWith("*")) {
        const temp = answer.replace(/^#+/, '').replace(/^\*+/, '\n');
        return temp.replace(/#+/, '\n').replace(/\*+/, '\n')
    } else {
        return answer.replace(/#+/, '\n').replace(/\*+/, '\n')
    }
}