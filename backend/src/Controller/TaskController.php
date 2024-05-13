<?php

namespace App\Controller;

use App\Entity\Task;
use App\Utils\APIJsonResponse;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
class TaskController extends AbstractController
{
    private $em;
    private $taskRepository;

    public function __construct(EntityManagerInterface $em, TaskRepository $taskRepository)
    {
        $this->em = $em;
        $this->taskRepository = $taskRepository;
    }

    #[Route('/tasks', name: 'app_task', methods: ['GET'])]
    public function index(): Response
    {
        $tasks = $this->taskRepository->findAll();

        $data = [];
    
        foreach ($tasks as $task) {
            
           $data[] = $this->getTaskDetails($task);
        }

        return new APIJsonResponse([
            $data
        ]);
    }

    #[Route('/tasks/create', name: 'app_task_create', methods: ['GET', 'POST'])]
    public function create(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        if($data != null) {
            $task = new Task();
            $task->setTitle($data['title']);
            $task->setDescription($data['description']);
            $due_date = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dueDate']);
            if ($due_date) {
                $task->setDueDate($due_date);
            } else {
                // Return an error response if the dueDate value is not in a valid format
                return new APIJsonResponse(
                    null, false, 'Please enter the due date in a valid format', Response::HTTP_BAD_REQUEST
                );
            }
            $task->setCompleted($data['completed'] ?? false);
        
            $this->em->persist($task);
            $this->em->flush();
        
            $data =  $this->getTaskDetails($task);
                
            return new APIJsonResponse([
                $data
            ]);
        } else {
            return new APIJsonResponse(
                null, false, 'Please enter the details properly', Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/tasks/show/{id}', name: 'app_task_show', methods: ['GET'])]
    public function show(int $id): Response
    {
        $task = $this->taskRepository->find($id);

        if(!$task) {
            return new APIJsonResponse(
                null, false, 'No task details found for id ' . $id, Response::HTTP_NOT_FOUND
            );
        }

        return new APIJsonResponse([
            $this->getTaskDetails($task)
        ]);
    }

    #[Route('/tasks/{id}/edit', name: 'app_task_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, int $id): Response
    {
        $task = $this->taskRepository->find($id);

        if(!$task) {
            return new APIJsonResponse(
                null, false, 'No task details found for id ' . $id, Response::HTTP_NOT_FOUND
            );
        } 

        $data = json_decode($request->getContent(), true);

        if($data != null) {
            $task->setTitle($data['title']);
            $task->setDescription($data['description']);
            $due_date = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dueDate']);
            $task->setDueDate($due_date);
            $task->setCompleted(false);
        
            $this->em->persist($task);
            $this->em->flush();
                
            return new APIJsonResponse(
                $this->getTaskDetails($task), true, 'The task details is updated successfully', Response::HTTP_OK
            );
        } else {
            return new APIJsonResponse(
                null, false, 'Please enter the details properly', Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route('/tasks/{id}/delete', name: 'app_task_delete', methods: ['delete'])]
    public function delete(Request $request, int $id): Response
    {
        $task = $this->taskRepository->find($id);

        if(!$task) {
            return new APIJsonResponse(
                null, 
                false, 
                'No task details found for id ' . $id, 
                Response::HTTP_NOT_FOUND
            );
        }

        $this->em->remove($task);
        $this->em->flush();

        return new APIJsonResponse(
            $this->getTaskDetails($task), 
            true, 
            'Task details deleted successfully', 
            Response::HTTP_OK
        );
    }

    public function getTaskDetails($task)
    {
        return [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'due_date' => $task->getDueDate(),
            'completed' => $task->isCompleted(),
            'created_at' => $task->getCreatedAt(),
            'updated_at' => $task->getUpdatedAt(),
        ];
    }

    #[Route('/tasks/{id}/completed', name: 'app_task_completed', methods: ['GET'])]
    public function markAsCompleted(Request $request, int $id): Response
    {
        $task = $this->taskRepository->find($id);

        if(!$task) {
            return new APIJsonResponse(
                null, 
                false, 
                'No task details found for id ' . $id, 
                Response::HTTP_NOT_FOUND
            );
        }

        $task->setCompleted(true);

        $this->em->persist($task);
        $this->em->flush();

        return new APIJsonResponse(
            $this->getTaskDetails($task), 
            true, 
            'Task has been mark as completed', 
            Response::HTTP_OK
        );
    }
    
}
