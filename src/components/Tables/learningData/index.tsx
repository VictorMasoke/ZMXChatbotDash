"use client";

import { useState, useEffect } from "react";
import { getAILearningData, deleteAILearningData, addAILearningData } from "../fetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";

export default function AILearningTable() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newData, setNewData] = useState({
    model_name: "",
    input_text: "",
    prediction: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await getAILearningData();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteAILearningData(id);
        fetchData(); // Refresh data after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleAdd = async () => {
    if (!newData.model_name || !newData.input_text) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await addAILearningData(newData);

      if (response.message === "AI learning data added successfully") {
        fetchData(); // Refresh data after adding
        setNewData({ model_name: "", input_text: "", prediction: "" });
      } else {
        throw new Error("Failed to add data");
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <>

      <div className="grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Add New Data Form */}
        <div className="p-6.5 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5.5">
            <div>
              <InputGroup
                label="Model Name"
                value={newData.model_name}
                handleChange={(e) =>
                  setNewData({ ...newData, model_name: e.target.value })
                }
                placeholder="Enter model name"
                type="text"
              />
            </div>
            <div>
              <TextAreaGroup
                label="Input Text"
                defaultValue={newData.input_text}
                onChange={(e) =>
                  setNewData({ ...newData, input_text: e.target.value })
                }
                placeholder="Enter input text"
              />
            </div>
            <div>
              <TextAreaGroup
                label="Prediction"
                defaultValue={newData.prediction}
                onChange={(e) =>
                  setNewData({ ...newData, prediction: e.target.value })
                }
                placeholder="Enter prefered answer"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                Add New Data
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-6.5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead>Input Text</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.model_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.input_text}
                    </TableCell>
                    <TableCell>{item.prediction}</TableCell>
                    <TableCell>
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleView(item)}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Learning Data Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-5.5 py-4">
                <div>
                  <InputGroup
                    label="ID"
                    placeholder="ID"
                    value={selectedItem.id}
                    disabled
                    type="text"
                  />
                </div>
                <div>
                  <InputGroup
                    label="Model Name"
                    placeholder="Model Name"
                    value={selectedItem.model_name}
                    disabled
                    type="text"
                  />
                </div>
                <div>
                  <TextAreaGroup
                    label="Input Text"
                    placeholder="Input Text"
                    defaultValue={selectedItem.input_text}
                    disabled
                  />
                </div>
                <div>
                  <InputGroup
                    label="Prediction"
                    value={selectedItem.prediction}
                    placeholder="Prediction"
                    disabled
                    type="text"
                  />
                </div>
                <div>
                  <InputGroup
                    label="Timestamp"
                    placeholder="Timestamp"
                    value={new Date(selectedItem.timestamp).toLocaleString()}
                    disabled
                    type="text"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
